/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import prepForCall from "../webrtcUtilities/prepForCall";
import socketConnection from "../webrtcUtilities/socketConnection";
import clientSocketListeners from "../webrtcUtilities/clientSocketListeners";
import { useState } from "react";
import createPeerConnection from "../webrtcUtilities/createPeerConn";
import { useNavigate } from "react-router-dom";
type Props = {
  remoteStream: any;
  localStream: any;
  peerConnection: any;
  setPeerConnection: any;
  callStatus: any;
  updateCallStatus: any;
  offerData: any;
  setOfferData: any;
  userName: any;
  setUserName: any;
  setLocalStream: any;
  setRemoteStream: any;
};
const Home = ({
  callStatus,
  updateCallStatus,
  setLocalStream,
  setRemoteStream,
  remoteStream,
  peerConnection,
  setPeerConnection,
  userName,
  setUserName,
  setOfferData,
}: Props) => {
  const [typeOfCall, setTypeOfCall] = useState();
  const [joined, setJoined] = useState(false);
  const [availableCalls, setAvailableCalls] = useState([]);
  const navigate = useNavigate();

  //called on "Call" or "Answer"
  const initCall = async (typeOfCall: any) => {
    // set localStream and GUM
    await prepForCall(callStatus, updateCallStatus, setLocalStream);
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
      setUserName(userName);
      const setCalls = (data: any) => {
        setAvailableCalls(data);
        console.log(data);
      };
      const socket = socketConnection(userName);
      socket.on("availableOffers", setCalls);
      socket.on("newOfferWaiting", setCalls);
    }
  }, [joined, setUserName]);

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
  }, [
    callStatus.haveMedia,
    peerConnection,
    setPeerConnection,
    setRemoteStream,
    typeOfCall,
    userName,
  ]);

  //We know which type of client this is and have PC.
  //Add socketlisteners
  useEffect(() => {
    if (typeOfCall && peerConnection) {
      const socket = socketConnection(userName);
      clientSocketListeners(
        socket,
        typeOfCall,
        callStatus,
        updateCallStatus,
        peerConnection
      );
    }
  }, [typeOfCall, peerConnection, userName, callStatus, updateCallStatus]);

  //once remoteStream AND pc are ready, navigate
  useEffect(() => {
    if (remoteStream && peerConnection) {
      navigate(`/${typeOfCall}?token=${Math.random()}`);
    }
  }, [remoteStream, peerConnection, navigate, typeOfCall]);

  const call = async () => {
    //call related stuff goes here
    initCall("offer");
  };

  const answer = (callData: any) => {
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
          {availableCalls.map((callData: any, i) => (
            <div className="col mb-2" key={i}>
              <button
                onClick={() => {
                  answer(callData);
                }}
                className="btn btn-lg btn-warning hang-up"
              >
                Answer Call From {callData.offererUserName}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
