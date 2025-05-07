import { useState } from "react";
import { useCallStore } from "../../store/webrtcStore";

const AudioButton = () => {
  const { callStatus, setCallStatus, localStream, peerConnection } =
    useCallStore();
  const [audioEnabled, setAudioEnabled] = useState<boolean>(
    callStatus.audioEnabled
  );

  const startStopAudio = () => {
    const updatedCallStatus = { ...callStatus };

    if (audioEnabled) {
      updatedCallStatus.audioEnabled = false;
      setCallStatus(updatedCallStatus);
      setAudioEnabled(false);
      localStream?.getAudioTracks().forEach((track) => (track.enabled = false));
    } else if (audioEnabled === false) {
      updatedCallStatus.audioEnabled = true;
      setCallStatus(updatedCallStatus);
      setAudioEnabled(true);
      localStream?.getAudioTracks().forEach((track) => (track.enabled = true));
    } else {
      // If audioEnabled is null or undefined, try adding tracks
      localStream?.getAudioTracks().forEach((track) => {
        peerConnection?.addTrack(track, localStream);
      });
    }
  };

  return (
    <div className="inline-block relative">
      <div
        onClick={startStopAudio}
        className={`flex flex-col items-center justify-center px-4 py-4 rounded cursor-pointer transition duration-200
          ${
            audioEnabled
              ? "text-white hover:bg-teal-500/20"
              : "text-red-500 hover:bg-red-500/20"
          }
        `}
      >
        <i
          className={`fa ${
            audioEnabled ? "fa-microphone" : "fa-microphone-slash"
          } text-[32px] mb-1 transition-all duration-200`}
        ></i>
        <div className="text-sm">{audioEnabled ? "Mute" : "Unmute"}</div>
      </div>
    </div>
  );
};

export default AudioButton;
