import { useCallStore } from "../../store/webrtcStore";

const AudioButton = () => {
  const { callStatus, setCallStatus, localStream, peerConnection } =
    useCallStore();

  const micText = "On";

  const startStopAudio = () => {
    const copyCallStatus = { ...callStatus };
    //first, check if the audio is enabled, if so disabled
    if (callStatus.audioEnabled === true) {
      //update redux callStatus
      copyCallStatus.audioEnabled = false;
      setCallStatus(copyCallStatus);
      //set the stream to disabled
      const tracks = localStream?.getAudioTracks();
      tracks?.forEach((t) => (t.enabled = false));
    } else if (callStatus.audioEnabled === false) {
      //second, check if the audio is disabled, if so enable
      //update redux callStatus
      copyCallStatus.audioEnabled = true;
      setCallStatus(copyCallStatus);
      const tracks = localStream?.getAudioTracks();
      tracks?.forEach((t) => (t.enabled = true));
    } else {
      //audio is "off" What do we do?
      // changeAudioDevice({target:{value:"inputdefault"}})
      //add the tracks
      localStream?.getAudioTracks().forEach((t) => {
        peerConnection?.addTrack(t, localStream);
      });
    }
  };

  return (
    <div className="inline-block relative">
      <div
        className=" text-white flex flex-col items-center justify-center px-4 py-4 rounded cursor-pointer hover:bg-gray-400 hover:bg-opacity-20 transition"
        onClick={startStopAudio}
      >
        <i className="fa fa-microphone text-[32px] mb-1"></i>
        <div className="text-sm">{micText}</div>
      </div>
    </div>
  );
};

export default AudioButton;
