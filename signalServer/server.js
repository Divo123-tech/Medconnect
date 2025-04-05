const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const app = express();
const socketio = require("socket.io");
app.use(express.static(__dirname));

////**MAJOR CHANGE**////

//we need a key and cert to run https
//we generated them with mkcert
// $ mkcert create-ca
// $ mkcert create-cert
// const key = fs.readFileSync('cert.key');
// const cert = fs.readFileSync('cert.crt');

//we changed our express setup so we can use https
//pass the key and cert to createServer on https
// const expressServer = https.createServer({key, cert}, app);

const expressServer = http.createServer(app);
//create our socket.io server... it will listen to our express port
const io = socketio(expressServer, {
  cors: {
    origin: [
      "https://localhost:3000",
      "https://localhost:3001",
      "http://localhost:5173",
      "https://192.168.1.44:3000",
      // 'https://LOCAL-DEV-IP-HERE' //if using a phone or another computer
    ],
    methods: ["GET", "POST"],
  },
});

expressServer.listen(8181);

//offers will contain {}
const offers = [
  // offererUserName
  // offer
  // offerIceCandidates
  // answererUserName
  // answer
  // answererIceCandidates
];
const connectedSockets = [
  //username, socketId
];

io.on("connection", (socket) => {
  // console.log("Someone has connected");
  const userName = socket.handshake.auth.userName;
  const password = socket.handshake.auth.password;
  if (password !== "x") {
    socket.disconnect(true);
    return;
  }
  const userExists = connectedSockets.some(
    (connection) => connection.userName === userName
  );
  console.log(socket.id);
  if (!userExists) {
    connectedSockets.push({
      socketId: socket.id,
      userName,
    });
  }
  console.log("connected Sockets", connectedSockets);

  //test connectivity
  // socket.on('test',ack=>{
  //     ack('pong')
  // })

  //a new client has joined. If there are any offers available,
  //emit them out
  if (offers.length) {
    console.log("CONNECTED!!!!!!!");
    socket.emit("availableOffers", offers);
  }

  socket.on("newOffer", (newOffer) => {
    console.log("newOffer!");
    // console.log(newOffer);
    offers.push({
      offererUserName: userName,
      offer: newOffer.offer,
      offerIceCandidates: [],
      answererUserName: null,
      answer: null,
      answererIceCandidates: [],
      offeringTo: newOffer.offerTo,
    });
    // console.log(newOffer.sdp.slice(50))
    //send out to all connected sockets EXCEPT the caller
    // console.log("Emmiting newOfferAwaiting", offers);
    socket.broadcast.emit("newOfferAwaiting", offers.slice(-1));
  });

  socket.on("getOffers", () => {
    console.log("get offers triggered");
    console.log("sending offers: ", offers);
    socket.emit("availableOffers", offers);
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    // console.log(offerObj);
    console.log(connectedSockets);
    console.log("Requested offerer", offerObj.offererUserName);
    //emit this answer (offerObj) back to CLIENT1
    //in order to do that, we need CLIENT1's socketid
    const socketToAnswer = connectedSockets.find(
      (s) => s.userName === offerObj.offererUserName
    );
    if (!socketToAnswer) {
      console.log("No matching socket");
      return;
    }
    //we found the matching socket, so we can emit to it!
    const socketIdToAnswer = socketToAnswer.socketId;
    //we find the offer to update so we can emit it
    const offerToUpdate = offers.find(
      (o) => o.offererUserName === offerObj.offererUserName
    );
    if (!offerToUpdate) {
      console.log("No OfferToUpdate");
      return;
    }
    //send back to the answerer all the iceCandidates we have already collected
    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUserName = userName;
    console.log(offerToUpdate);
    //socket has a .to() which allows emiting to a "room"
    //every socket has it's own room
    console.log(socketIdToAnswer);
    socket.to(socketIdToAnswer).emit("answerResponse", offerToUpdate);
  });

  socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj) => {
    const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
    // console.log(iceCandidate);
    if (didIOffer) {
      //this ice is coming from the offerer. Send to the answerer
      const offerInOffers = offers.find(
        (o) => o.offererUserName === iceUserName
      );
      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        // 1. When the answerer answers, all existing ice candidates are sent
        // 2. Any candidates that come in after the offer has been answered, will be passed through
        if (offerInOffers.answererUserName) {
          //pass it through to the other socket
          const socketToSendTo = connectedSockets.find(
            (s) => s.userName === offerInOffers.answererUserName
          );
          if (socketToSendTo) {
            socket
              .to(socketToSendTo.socketId)
              .emit("receivedIceCandidateFromServer", iceCandidate);
          } else {
            console.log("Ice candidate recieved but could not find answere");
          }
        }
      }
    } else {
      //this ice is coming from the answerer. Send to the offerer
      //pass it through to the other socket
      const offerInOffers = offers.find(
        (o) => o.answererUserName === iceUserName
      );
      if (offerInOffers) {
        const socketToSendTo = connectedSockets.find(
          (s) => s.userName === offerInOffers.offererUserName
        );
        if (socketToSendTo) {
          socket
            .to(socketToSendTo.socketId)
            .emit("receivedIceCandidateFromServer", iceCandidate);
        } else {
          console.log("Ice candidate recieved but could not find offerer");
        }
      }
    }
    // console.log(offers)
  });

  socket.on("disconnect", (userName) => {
    // const offerToClear = offers.findIndex(
    //   (o) => o.offererUserName === userName
    // );
    // offers.splice(offerToClear, 1);
    const socketIdx = connectedSockets.findIndex(
      (s) => s.socketId === socket.id
    );
    if (socketIdx !== -1) {
      connectedSockets.splice(socketIdx, 1);
    }
    console.log(connectedSockets);
    let userThatHungUp;
    let otherUser;
    let offerToUpdate;
    for (const offer of offers) {
      if (offer.offererUserName == userName) {
        userThatHungUp = "offerer";
        otherUser = offer.answererUserName;
        offerToUpdate = offer;
      }
      if (offer.answererUserName == userName) {
        userThatHungUp = "answerer";
        otherUser = offer.offererUserName;
        offerToUpdate = offer;
      }
    }
    if (!userThatHungUp) {
      return false;
    }
    const offerToClear = offers.indexOf(offerToUpdate);
    offers.splice(offerToClear, 1);

    console.log(offerToUpdate);

    const socketToSendTo = connectedSockets.find(
      (s) => s.userName === otherUser
    );
    console.log(socketToSendTo);
    if (socketToSendTo) {
      socket.to(socketToSendTo.socketId).emit("hangup");
    }

    socket.emit("availableOffers", offers);
  });

  socket.on("hangup", (userName) => {
    let userThatHungUp;
    let otherUser;
    let offerToUpdate;
    for (const offer of offers) {
      if (offer.offererUserName == userName) {
        userThatHungUp = "offerer";
        otherUser = offer.answererUserName;
        offerToUpdate = offer;
      }
      if (offer.answererUserName == userName) {
        userThatHungUp = "answerer";
        otherUser = offer.offererUserName;
        offerToUpdate = offer;
      }
    }
    const offerToClear = offers.indexOf(offerToUpdate);
    offers.splice(offerToClear, 1);

    console.log("this is the offerToUpdate", offerToUpdate);
    if (!userThatHungUp) {
      return false;
    }
    const socketToSendTo = connectedSockets.find(
      (s) => s.userName === otherUser
    );
    console.log(socketToSendTo);
    if (socketToSendTo) {
      socket.to(socketToSendTo.socketId).emit("hangup");
    }
  });
});
