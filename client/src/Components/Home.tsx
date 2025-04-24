import { SetStateAction, useEffect } from "react";
import prepForCall from "../webrtcUtilities/prepForCall";
import socketConnection from "../webrtcUtilities/socketConnection";
import clientSocketListeners from "../webrtcUtilities/clientSocketListeners";
import { useState } from "react";
import createPeerConnection from "../webrtcUtilities/createPeerConn";
import { useNavigate } from "react-router-dom";
import { useCallStore } from "../store/webrtcStore";
import { Offer } from "../utils/types";
type Props = {
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
};
const Home = ({ setRemoteStream, remoteStream }: Props) => {
  const [typeOfCall, setTypeOfCall] = useState<string>("");
  const [joined, setJoined] = useState(false);
  const [availableCalls, setAvailableCalls] = useState([]);
  const navigate = useNavigate();
  const {
    username,
    setUserName,
    callStatus,
    setCallStatus,
    localStream,
    setLocalStream,
    peerConnection,
    setUserOfferTo,
    setOfferData,
    setPeerConnection,
  } = useCallStore();

  //called on "Call" or "Answer"
  const initCall = async (typeOfCall: string) => {
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
      setUserOfferTo(userToOffer || "");
      setUserName(userName || "");
      const socket = socketConnection(userName || "");

      const setCalls = (data: SetStateAction<never[]>) => {
        setAvailableCalls(data);
        console.log(data);
      };
      //emitting get offers
      socket?.emit("getOffers");
      socket?.on("availableOffers", setCalls);
      socket?.on("newOfferAwaiting", setCalls);
    }
  }, [joined, setUserName, setUserOfferTo]);

  //We have media via GUM. setup the peerConnection w/listeners
  useEffect(() => {
    console.log("signaling state", peerConnection);
    console.log("Call status", callStatus);
    if (
      callStatus.haveMedia &&
      (!peerConnection || peerConnection.signalingState == "closed")
    ) {
      // prepForCall has finished running and updated callStatus
      console.log("NEW PEER CONNECTION");
      const createdPeerConnection = createPeerConnection(username, typeOfCall);
      if (createdPeerConnection == undefined) {
        return;
      } else {
        const { peerConnection, remoteStream } = createdPeerConnection;
        setPeerConnection(peerConnection);
        setRemoteStream(remoteStream);
      }
    }
  }, [
    callStatus,
    peerConnection,
    setPeerConnection,
    setRemoteStream,
    typeOfCall,
    username,
  ]);

  //We know which type of client this is and have PC.
  //Add socketlisteners
  useEffect(() => {
    if (typeOfCall && peerConnection) {
      const socket = socketConnection(username);
      clientSocketListeners(
        socket,
        typeOfCall,
        localStream,
        callStatus,
        setCallStatus,
        peerConnection,
        setRemoteStream
      );
    }
  }, [
    typeOfCall,
    peerConnection,
    username,
    localStream,
    callStatus,
    setCallStatus,
    setRemoteStream,
  ]);

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

  const answer = (callData: Offer) => {
    //answer related stuff goes here
    initCall("answer");
    setOfferData(callData);
  };

  if (!joined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => setJoined(true)}
          className="bg-blue-600 text-white text-lg px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <h1 className="text-2xl font-bold">{username}</h1>

        {/* Make a Call */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Make a call</h2>
          <button
            onClick={call}
            className="bg-green-600 text-white text-lg px-6 py-3 rounded hover:bg-green-700 transition-colors"
          >
            Start Call
          </button>
        </div>

        {/* Available Calls */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-2">Available Calls</h2>
          <p className="mb-4">{availableCalls.length}</p>

          {availableCalls
            .filter((callData: Offer) => callData.offeringTo == username)
            .map((callData: Offer, i) => (
              <div className="mb-2" key={i}>
                <button
                  onClick={() => answer(callData)}
                  className="bg-yellow-500 text-black text-lg px-6 py-3 rounded hover:bg-yellow-600 transition-colors"
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
