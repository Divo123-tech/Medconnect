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
        onClick={startStopVideo}
        className={`flex flex-col items-center justify-center px-4 py-4 rounded cursor-pointer transition duration-300 ${
          videoEnabled
            ? "text-white hover:bg-teal-500/20 hover:bg-opacity-20"
            : "text-red-500 hover:bg-red-100 hover:bg-opacity-20"
        }`}
      >
        <i
          className={`${
            videoEnabled ? "fa fa-video" : "fa fa-video-slash"
          } text-[32px] mb-1`}
        ></i>
        <div className="text-sm">{videoEnabled ? "Stop" : "Start"} Video</div>
      </div>
    </div>
  );
};
export default VideoButton;
