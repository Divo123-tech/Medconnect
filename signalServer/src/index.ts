import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";

const app = express();
app.use(express.static(__dirname));

// Optional HTTPS
// const key = fs.readFileSync('cert.key');
// const cert = fs.readFileSync('cert.crt');
// const expressServer = https.createServer({ key, cert }, app);

const expressServer = http.createServer(app);

const io = new SocketIOServer(expressServer, {
  cors: {
    origin: [
      "https://localhost:3000",
      "https://localhost:3001",
      "http://localhost:5173",
      "https://192.168.1.44:3000",
    ],
    methods: ["GET", "POST"],
  },
});

expressServer.listen(8181, () => {
  console.log("Server running on port 8181");
});

type SDP = { sdp: string; type: string };

type IceCandidate = {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
};

type Offer = {
  offererUserName: string;
  offer: SDP;
  offerIceCandidates: IceCandidate[];
  answererUserName: string | null;
  answer: SDP | null;
  answererIceCandidates: IceCandidate[];
  offeringTo: string;
  offererFullName: string;
  scheduledTime: string;
  appointmentId: string | number;
};

type ConnectedSocket = {
  username: string;
  socketId: string;
};

const offers: Offer[] = [];
const connectedSockets: ConnectedSocket[] = [];

io.on("connection", (socket: Socket) => {
  const { userName, password } = socket.handshake.auth as {
    userName: string;
    password: string;
  };

  if (password !== "x") {
    socket.disconnect(true);
    return;
  }

  const exists = connectedSockets.some((conn) => conn.username === userName);
  if (!exists) {
    connectedSockets.push({ username: userName, socketId: socket.id });
  }

  console.log("Connected sockets:", connectedSockets);

  if (offers.length) {
    socket.emit("availableOffers", offers);
  }
  socket.on("registerInfo", (data) => {
    console.log("Extra user data received:", data);
    // { firstName, lastName, time }
  });

  socket.on(
    "newOffer",
    (newOffer: {
      offer: any;
      offerTo: string;
      offererFullName: string;
      scheduledTime: string;
      appointmentId: string | number;
    }) => {
      const offer: Offer = {
        offererUserName: userName,
        offer: newOffer.offer,
        offerIceCandidates: [],
        answererUserName: null,
        answer: null,
        answererIceCandidates: [],
        offeringTo: newOffer.offerTo,
        offererFullName: newOffer.offererFullName,
        scheduledTime: newOffer.scheduledTime,
        appointmentId: newOffer.appointmentId,
      };
      offers.push(offer);
      socket.broadcast.emit("availableOffer", offer);
    }
  );

  socket.on("getOffer", (email: string) => {
    for (const offer of offers) {
      if (offer.offeringTo == email) {
        socket.emit("availableOffer", offer);
      }
    }
  });

  socket.on("getOffers", () => {
    socket?.emit("availableOffers", offers);
  });

  socket.on(
    "newAnswer",
    (offerObj: Offer, ackFunction: (iceCandidates: any[]) => void) => {
      const socketToAnswer = connectedSockets.find(
        (s) => s.username === offerObj.offererUserName
      );
      const offerToUpdate = offers.find(
        (o) => o.offererUserName === offerObj.offererUserName
      );
      if (!socketToAnswer || !offerToUpdate) return;

      ackFunction(offerToUpdate.offerIceCandidates);
      offerToUpdate.answer = offerObj.answer;
      offerToUpdate.answererUserName = userName;

      socket.to(socketToAnswer.socketId).emit("answerResponse", offerToUpdate);
    }
  );

  socket.on(
    "sendIceCandidateToSignalingServer",
    (data: { didIOffer: boolean; iceUserName: string; iceCandidate: any }) => {
      const { didIOffer, iceUserName, iceCandidate } = data;
      if (didIOffer) {
        const offer = offers.find((o) => o.offererUserName === iceUserName);
        if (offer) {
          offer.offerIceCandidates.push(iceCandidate);
          if (offer.answererUserName) {
            const socketToSendTo = connectedSockets.find(
              (s) => s.username === offer.answererUserName
            );
            if (socketToSendTo) {
              socket
                .to(socketToSendTo.socketId)
                .emit("receivedIceCandidateFromServer", iceCandidate);
            }
          }
        }
      } else {
        const offer = offers.find((o) => o.answererUserName === iceUserName);
        if (offer) {
          const socketToSendTo = connectedSockets.find(
            (s) => s.username === offer.offererUserName
          );
          if (socketToSendTo) {
            socket
              .to(socketToSendTo.socketId)
              .emit("receivedIceCandidateFromServer", iceCandidate);
          }
        }
      }
    }
  );

  const cleanUpUser = (disconnectingUser: string) => {
    const socketIdx = connectedSockets.findIndex(
      (s) => s.socketId === socket.id
    );
    if (socketIdx !== -1) connectedSockets.splice(socketIdx, 1);

    let otherUser: string | null = null;
    const offerIndex = offers.findIndex(
      (o) =>
        o.offererUserName === disconnectingUser ||
        o.answererUserName === disconnectingUser
    );

    if (offerIndex !== -1) {
      const offer = offers[offerIndex];
      otherUser =
        offer.offererUserName === disconnectingUser
          ? offer.answererUserName
          : offer.offererUserName;
      offers.splice(offerIndex, 1);

      const socketToNotify = connectedSockets.find(
        (s) => s.username === otherUser
      );
      if (socketToNotify) {
        console.log("found the socket to notify!", socketToNotify);
        socket.to(socketToNotify.socketId).emit("hangup");
      }
    }

    socket.emit("availableOffers", offers);
  };

  socket.on("disconnect", () => {
    cleanUpUser(userName);
  });

  socket.on("hangup", () => {
    socket.emit("test");
    cleanUpUser(userName);
  });
});
