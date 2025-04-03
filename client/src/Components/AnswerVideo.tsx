import { useEffect, useRef, useState } from "react";
import "./VideoPage.css";
import { useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";

const AnswerVideo = ({
  remoteStream,
  localStream,
  peerConnection,
  callStatus,
  setCallStatus,
  offerData,
  userName,
}) => {
  const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
  const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const [answerCreated, setAnswerCreated] = useState(false);

  //send back to home if no localStream
  useEffect(() => {
    if (!localStream) {
      navigate(`/`);
    } else {
      //   //set video tags
      //   remoteFeedEl.current.srcObject = remoteStream;
      //   localFeedEl.current.srcObject = localStream;
      localFeedEl.current.srcObject = localStream;

      if (callStatus.videoEnabled != null) {
        remoteFeedEl.current.srcObject = remoteStream;
      }
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

  //User has enabled video, but not made answer
  useEffect(() => {
    const addOfferAndCreateAnswerAsync = async () => {
      //add the offer
      await peerConnection.setRemoteDescription(offerData.offer);
      console.log(peerConnection.signalingState); //have remote-offer
      //now that we have the offer set, make our answer
      console.log("Creating answer...");
      const answer = await peerConnection.createAnswer();
      peerConnection.setLocalDescription(answer);
      const copyOfferData = { ...offerData };
      copyOfferData.answer = answer;
      copyOfferData.answerUserName = userName;
      const socket = socketConnection(userName);
      const offerIceCandidates = await socket.emitWithAck(
        "newAnswer",
        copyOfferData
      );
      offerIceCandidates.forEach((c) => {
        peerConnection.addIceCandidate(c);
        console.log("==Added ice candidate from offerer==");
      });
      setAnswerCreated(true);
    };

    if (!answerCreated && callStatus.videoEnabled) {
      addOfferAndCreateAnswerAsync();
    }
  }, [callStatus.videoEnabled, answerCreated]);

  //
  const shareVideo = async () => {};
  if (!answerCreated && callStatus.videoEnabled == null) {
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
            setCallStatus(copyCallStatus);
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
          style={
            remoteStream?.active === false
              ? {
                  height: "90vh",
                  width: "100vw",
                  backgroundColor: "#222",
                }
              : {
                  position: "absolute",
                  zIndex: "2",
                  right: "5%",
                  bottom: "10%",
                  width: "10%",
                  display: "block",
                }
          }
        ></video>
        <video
          id="remote-feed"
          ref={remoteFeedEl}
          autoPlay
          controls
          style={{
            ...(remoteStream?.active === false ? { visibility: "hidden" } : {}),
            height: "90vh",
            width: "100vw",
            backgroundColor: "#222",
          }}
          playsInline
        ></video>
      </div>
      <ActionButtons
        localFeedEl={localFeedEl}
        remoteFeedEl={remoteFeedEl}
        callStatus={callStatus}
        localStream={localStream}
        setCallStatus={setCallStatus}
        userName={userName}
        peerConnection={peerConnection}
      />
    </div>
  );
};

export default AnswerVideo;
