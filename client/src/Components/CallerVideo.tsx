import { useEffect, useRef, useState } from "react";
import "./VideoPage.css";
import { useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";

const CallerVideo = ({
  userOfferTo,
  remoteStream,
  localStream,
  peerConnection,
  callStatus,
  updateCallStatus,
  userName,
}) => {
  const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const [offerCreated, setOfferCreated] = useState(false);

  //send back to home if no localStream
  useEffect(() => {
    console.log("call Status", callStatus);
    if (!localStream) {
      navigate(`/`);
    } else {
      localFeedEl.current.srcObject = localStream;

      if (callStatus.videoEnabled != null) {
        remoteFeedEl.current.srcObject = remoteStream;
      }
      //set video tags
    }
  }, [callStatus, localStream, navigate, remoteStream]);

  //set video tags
  // useEffect(()=>{
  //     remoteFeedEl.current.srcObject = remoteStream
  //     localFeedEl.current.srcObject = localStream
  // },[])

  //if we have tracks, disable the video message
  useEffect(() => {
    if (peerConnection) {
      peerConnection.ontrack = (e) => {
        if (e?.streams?.length) {
          setVideoMessage("");
        } else {
          setVideoMessage("Disconnected...");
        }
      };
    }
  }, [peerConnection]);

  //once the user has shared video, start WebRTC'ing :)
  useEffect(() => {
    const shareVideoAsync = async () => {
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      //we can now start collecing ice candidates!
      // we need to emit the offer to the server
      const socket = socketConnection(userName);
      socket.emit("newOffer", { offer, offerTo: userOfferTo });
      setOfferCreated(true); //so that our useEffect doesn't make an offer again
      setVideoMessage("Awaiting answer..."); //update our videoMessage box
      console.log(
        "created offer, setLocalDesc, emitted offer, updated videoMessage"
      );
    };
    if (!offerCreated && callStatus.videoEnabled) {
      //CREATE AN OFFER!!
      console.log("We have video and no offer... making offer");
      shareVideoAsync();

      // we are not adding tracks so they are visible
      // in the video tag. We are addign them
      // to the PC, so they can be sent
    }
  }, [callStatus.videoEnabled, offerCreated]);

  useEffect(() => {
    const addAnswerAsync = async () => {
      await peerConnection.setRemoteDescription(callStatus.answer);
      console.log("Answer added!!");
    };
    if (callStatus.answer) {
      addAnswerAsync();
    }
  }, [callStatus]);

  if (!offerCreated && callStatus.videoEnabled == null) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "4rem",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <video
          id="local-feed"
          ref={localFeedEl}
          autoPlay
          controls
          playsInline
          style={{
            width: "720px",
            height: "400px",
            objectFit: "cover",
          }}
        ></video>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => {
            const copyCallStatus = { ...callStatus };
            copyCallStatus.videoEnabled = true;
            updateCallStatus(copyCallStatus);
            localStream.getTracks().forEach((track) => {
              peerConnection.addTrack(track, localStream);
            });
          }}
        >
          Join Call
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="videos">
        <VideoMessageBox message={videoMessage} />
        <video
          id="local-feed"
          ref={localFeedEl}
          autoPlay
          controls
          playsInline
          style={{
            position: "absolute",
            zIndex: "2",
            right: "5%",
            bottom: "10%",
            width: "10%",
          }}
        ></video>
        <video
          id="remote-feed"
          ref={remoteFeedEl}
          autoPlay
          controls
          playsInline
        ></video>
      </div>
      <ActionButtons
        localFeedEl={localFeedEl}
        remoteFeedEl={remoteFeedEl}
        callStatus={callStatus}
        localStream={localStream}
        updateCallStatus={updateCallStatus}
        peerConnection={peerConnection}
      />
    </div>
  );
};

export default CallerVideo;
