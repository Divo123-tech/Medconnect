import { SetStateAction, useEffect } from "react";
import prepForCall from "../webrtcUtilities/prepForCall";
import socketConnection from "../webrtcUtilities/socketConnection";
import clientSocketListeners from "../webrtcUtilities/clientSocketListeners";
import { useState } from "react";
import createPeerConnection from "../webrtcUtilities/createPeerConn";
import { useNavigate } from "react-router-dom";

const Home = ({
  userOfferTo,
  setUserOfferTo,
  callStatus,
  setCallStatus,
  setLocalStream,
  setRemoteStream,
  remoteStream,
  peerConnection,
  setPeerConnection,
  localStream,
  userName,
  setUserName,
  offerData,
  setOfferData,
}) => {
  const [typeOfCall, setTypeOfCall] = useState();
  const [joined, setJoined] = useState(false);
  const [availableCalls, setAvailableCalls] = useState([]);
  const navigate = useNavigate();

  //called on "Call" or "Answer"
  const initCall = async (typeOfCall) => {
    // set localStream and GUM
    await prepForCall(callStatus, setCallStatus, setLocalStream);
    // console.log("gum access granted!")

    setTypeOfCall(typeOfCall); //offer or answer
  };

  //Test backend connection
  // useEffect(()=>{
  //     const test = async()=>{
  //         const socket = socketConnection("test")
  //     }
  //     test()
  // },[])

  //Nothing happens until the user clicks join
  //(Helps with React double render)
  useEffect(() => {
    if (joined) {
      const userName = prompt("Enter username");
      const userToOffer = prompt("Enter username you're offering to");
      setUserOfferTo(userToOffer);
      setUserName(userName);
      const socket = socketConnection(userName);

      const setCalls = (data: SetStateAction<never[]>) => {
        setAvailableCalls(data);
        console.log(data);
      };
      //emitting get offers
      socket.on("availableOffers", setCalls);
      socket.on("newOfferAwaiting", setCalls);
    }
  }, [joined, setUserName, setUserOfferTo]);

  //We have media via GUM. setup the peerConnection w/listeners
  useEffect(() => {
    if (callStatus.haveMedia && !peerConnection) {
      // prepForCall has finished running and updated callStatus
      const { peerConnection, remoteStream } = createPeerConnection(
        userName,
        typeOfCall
      );
      setPeerConnection(peerConnection);
      setRemoteStream(remoteStream);
    }
  }, [callStatus, peerConnection]);

  //We know which type of client this is and have PC.
  //Add socketlisteners
  useEffect(() => {
    if (typeOfCall && peerConnection) {
      const socket = socketConnection(userName);
      clientSocketListeners(
        socket,
        typeOfCall,
        callStatus,
        setCallStatus,
        peerConnection,
        setRemoteStream
      );
    }
  }, [typeOfCall, peerConnection]);

  //once remoteStream AND pc are ready, navigate
  useEffect(() => {
    if (remoteStream && peerConnection) {
      if (typeOfCall) {
        navigate(`/${typeOfCall}?token=${Math.random()}`);
      } else {
        navigate("/");
      }
    }
  }, [remoteStream, peerConnection, typeOfCall, navigate]);

  const call = async () => {
    //call related stuff goes here

    initCall("offer");
  };

  const answer = (callData) => {
    //answer related stuff goes here
    initCall("answer");
    setOfferData(callData);
  };

  if (!joined) {
    return (
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <button
          onClick={() => setJoined(true)}
          className="btn btn-primary btn-lg"
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <h1>{userName}</h1>
        <div className="col-6">
          <h2>Make a call</h2>
          <button onClick={call} className="btn btn-success btn-lg hang-up">
            Start Call
          </button>
        </div>
        <div className="col-6">
          <h2>Available Calls</h2>
          <p>{availableCalls.length}</p>
          {availableCalls
            .filter((callData) => callData.offeringTo == userName) // Only include calls meant for Bobby
            .map((callData, i) => (
              <div className="col mb-2" key={i}>
                <button
                  onClick={() => answer(callData)}
                  className="btn btn-lg btn-warning hang-up"
                >
                  Answer Call From {callData.offererUserName} for{" "}
                  {callData.offeringTo}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
