import { useState } from "react";
import { useCallStore } from "../../store/webrtcStore";

const VideoButton = () => {
  const { callStatus, setCallStatus, localStream } = useCallStore();

  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  //handle user clicking on video button
  const startStopVideo = () => {
    const copyCallStatus = { ...callStatus };
    // useCases:
    if (copyCallStatus.videoEnabled) {
      // 1. Video is enabled, so we need to disable
      //disable
      copyCallStatus.videoEnabled = false;
      setCallStatus(copyCallStatus);
      setVideoEnabled(false);
      const tracks = localStream?.getVideoTracks();
      tracks?.forEach((track) => (track.enabled = false));
    } else {
      // 2. Video is disabled, so we need to enable
      copyCallStatus.videoEnabled = true;
      setCallStatus(copyCallStatus);
      setVideoEnabled(true);
      const tracks = localStream?.getVideoTracks();
      tracks?.forEach((track) => (track.enabled = true));
    }
  };

  return (
    <div className="inline-block relative">
      <div
        className=" text-white flex flex-col items-center justify-center px-4 py-4 rounded cursor-pointer hover:bg-gray-400 hover:bg-opacity-20 transition"
        onClick={startStopVideo}
      >
        <i className="fa fa-video text-[32px] mb-1"></i>
        <div className="text-sm">{videoEnabled ? "Stop" : "Start"} Video</div>
      </div>
    </div>
  );
};
export default VideoButton;
