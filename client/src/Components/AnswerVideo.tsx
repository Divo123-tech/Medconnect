import { useEffect, useRef, useState } from "react";
import "./VideoPage.css";
import { useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import { useCallStore } from "../store/webrtcStore";
import { IceCandidate } from "../utils/types";

type Props = {
  remoteStream: MediaStream | null;
};
const AnswerVideo = ({ remoteStream }: Props) => {
  const remoteFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  const localFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  const navigate = useNavigate();

  const [answerCreated, setAnswerCreated] = useState(false);
  const {
    username,
    callStatus,
    setCallStatus,
    localStream,
    peerConnection,
    offerData,
  } = useCallStore();
  //send back to home if no localStream
  useEffect(() => {
    if (!localStream) {
      navigate(`/`);
    } else {
      if (localFeedEl.current) {
        localFeedEl.current.srcObject = localStream;
      }

      console.log("local stream", localStream);
      console.log("remote stream", remoteStream);

      if (
        callStatus.videoEnabled != null &&
        remoteFeedEl.current &&
        remoteStream
      ) {
        remoteFeedEl.current.srcObject = remoteStream;
      }
    }
  }, [callStatus, localStream, navigate, remoteStream]);

  //set video tags
  // useEffect(()=>{
  //     remoteFeedEl.current.srcObject = remoteStream
  //     localFeedEl.current.srcObject = localStream
  // },[])

  //User has enabled video, but not made answer
  useEffect(() => {
    const addOfferAndCreateAnswerAsync = async () => {
      //add the offer
      console.log("offer data", offerData);
      if (offerData?.offer) {
        await peerConnection?.setRemoteDescription(offerData.offer);
      }
      console.log(peerConnection?.signalingState); //have remote-offer
      //now that we have the offer set, make our answer
      console.log("Creating answer...");
      const answer = await peerConnection?.createAnswer();
      peerConnection?.setLocalDescription(answer);
      const copyOfferData = { ...offerData };
      copyOfferData.answer = answer;
      copyOfferData.answererUserName = username;
      const socket = socketConnection(username);
      const offerIceCandidates = await socket?.emitWithAck(
        "newAnswer",
        copyOfferData
      );
      offerIceCandidates.forEach((c: IceCandidate) => {
        peerConnection?.addIceCandidate(c);
        console.log("==Added ice candidate from offerer==");
      });
      setAnswerCreated(true);
    };

    if (!answerCreated && callStatus.videoEnabled) {
      addOfferAndCreateAnswerAsync();
    }
  }, [
    callStatus.videoEnabled,
    answerCreated,
    offerData,
    peerConnection,
    username,
  ]);

  //
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
            localStream?.getTracks().forEach((track) => {
              peerConnection?.addTrack(track, localStream);
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
      <ActionButtons />
    </div>
  );
};

export default AnswerVideo;
