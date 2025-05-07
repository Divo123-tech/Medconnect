import { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketConnection from "../../utils/webrtcUtilities/socketConnection";
import ActionButtons from "../ActionButtons/ActionButtons";
import { useCallStore } from "../../store/webrtcStore";
import { motion } from "framer-motion";
import { Eye, Sun, Users, Video, Volume2 } from "lucide-react";
import { useNoScroll } from "@/utils/hooks/noScroll";
type Props = {
  remoteStream: MediaStream | null;
};
const CallerVideo = ({ remoteStream }: Props) => {
  const remoteFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  const localFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  const navigate = useNavigate();
  const {
    username,
    callStatus,
    setCallStatus,
    localStream,
    peerConnection,
    userOfferTo,
    offerData,
  } = useCallStore();
  const [offerCreated, setOfferCreated] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useNoScroll();
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

  //once the user has shared video, start WebRTC'ing :)
  useEffect(() => {
    const shareVideoAsync = async () => {
      const offer = await peerConnection?.createOffer();
      peerConnection?.setLocalDescription(offer);
      //we can now start collecing ice candidates!
      // we need to emit the offer to the server
      const socket = socketConnection(username);
      socket?.emit("newOffer", {
        offer,
        offerTo: userOfferTo,
        offererFullName: offerData?.offererFullName,
        scheduledTime: offerData?.scheduledTime,
      });
      setOfferCreated(true); //so that our useEffect doesn't make an offer again
      console.log(
        "created offer, setLocalDesc, emitted offer, updated videoMessage"
      );
      console.log("peerconnect: ", peerConnection?.remoteDescription);
      console.log("callstatus.answer: ", callStatus);
    };
    if (!offerCreated && callStatus.videoEnabled) {
      //CREATE AN OFFER!!
      console.log("We have video and no offer... making offer");
      shareVideoAsync();
    }
  }, [
    callStatus,
    callStatus.videoEnabled,
    offerCreated,
    offerData?.offererFullName,
    offerData?.scheduledTime,
    peerConnection,
    userOfferTo,
    username,
  ]);

  useEffect(() => {
    const addAnswerAsync = async () => {
      if (callStatus.answer) {
        await peerConnection?.setRemoteDescription(callStatus.answer);
        console.log("Answer added!");
        setTimeout(forceUpdate, 100);
      }
    };
    addAnswerAsync();
  }, [callStatus, peerConnection]);

  if (!offerCreated && callStatus.videoEnabled == null) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center gap-5 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className=" bg-white/10 backdrop-blur-sm rounded-xl border border-gray-200/20 max-w-2xl"
        >
          <h3 className="text-center font-medium text-gray-800 mb-3">
            Tips for a great video call
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                <Sun className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-gray-700">Ensure good lighting on your face</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-700">
                Check your microphone before joining
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-700">Find a quiet, private location</p>
            </div>
          </div>
        </motion.div>
        <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-teal-200">
          <video
            id="local-feed"
            ref={localFeedEl}
            autoPlay
            muted
            playsInline
            className="w-[720px] h-[400px] object-cover rounded-xl"
          />
          <div className="absolute top-2 left-2 bg-teal-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm">
            <Eye className="h-4 w-4" />
            Preview
          </div>
        </div>

        <motion.button
          onClick={() => {
            const copyCallStatus = { ...callStatus };
            copyCallStatus.videoEnabled = true;
            setCallStatus(copyCallStatus);
            localStream?.getTracks().forEach((track) => {
              peerConnection?.addTrack(track, localStream);
            });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition-all"
        >
          <Video className="h-5 w-5" />
          Join Call
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden overflow-y-hidden">
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

export default CallerVideo;
