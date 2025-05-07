import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketConnection from "../../utils/webrtcUtilities/socketConnection";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useCallStore } from "../../store/webrtcStore";
import { IceCandidate } from "../../utils/types";

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
      navigate(`/dashboard`);
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
      <div className="flex flex-col justify-center items-center gap-16">
        <video
          id="local-feed"
          ref={localFeedEl}
          autoPlay
          controls
          playsInline
          className="w-[720px] h-[400px] object-cover"
        ></video>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-colors"
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
      <div className="absolute overflow-hidden">
        <video
          id="local-feed"
          ref={localFeedEl}
          autoPlay
          controls
          playsInline
          className={
            remoteStream?.active === false
              ? "h-[90vh] w-screen bg-[#222]"
              : "absolute z-20 right-[5%] bottom-[10%] w-[10%] block"
          }
        />

        <video
          id="remote-feed"
          ref={remoteFeedEl}
          autoPlay
          controls
          playsInline
          className={`h-[90vh] w-screen bg-[#222] ${
            remoteStream?.active === false ? "invisible" : ""
          }`}
        />
      </div>
      <ActionButtons />
    </div>
  );
};

export default AnswerVideo;
