import { useState } from "react";

const VideoButton = ({
  localFeedEl,
  callStatus,
  localStream,
  setCallStatus,
  peerConnection,
}) => {
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
      const tracks = localStream.getVideoTracks();
      tracks.forEach((track) => (track.enabled = false));
    } else {
      // 2. Video is disabled, so we need to enable
      copyCallStatus.videoEnabled = true;
      setCallStatus(copyCallStatus);
      setVideoEnabled(true);
      const tracks = localStream.getVideoTracks();
      tracks.forEach((track) => (track.enabled = true));
    }
  };

  return (
    <div className="button-wrapper video-button d-inline-block">
      <i className="fa fa-caret-up choose-video"></i>
      <div className="button camera" onClick={startStopVideo}>
        <i className="fa fa-video"></i>
        <div className="btn-text">{videoEnabled ? "Stop" : "Start"} Video</div>
      </div>
    </div>
  );
};
export default VideoButton;
