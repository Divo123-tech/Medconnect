import { Link } from "react-router";
import socketConnection from "../../webrtcUtilities/socketConnection";
import { useCallStore } from "../../store/webrtcStore";

const HangupButton = ({
  remoteFeedEl,
  localFeedEl,
  peerConnection,
  callStatus,
  setCallStatus,
  localStream,
}) => {
  const { username } = useCallStore();
  const hangupCall = () => {
    if (peerConnection) {
      setCallStatus((prevCallStatus) => {
        prevCallStatus.current = "complete";
        return prevCallStatus;
      });
      const socket = socketConnection(username);
      socket?.emit("hangup", username);
      //user has clicked hang up. pc:
      //close it
      //remove listeners
      // //set it to null
      peerConnection.close();
      peerConnection.onicecandidate = null;
      peerConnection.onaddstream = null;
      peerConnection = null;

      //set both video tags to empty
      localFeedEl.current.srcObject = null;
      remoteFeedEl.current.srcObject = null;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          if (track.kind === "video") {
            track.stop();
          }
        });
      }
    }
    //reload to clean up socket
    window.location.reload();
  };

  if (callStatus.current === "complete") {
    return <></>;
  }

  return (
    <Link to="/">
      <button onClick={hangupCall} className="btn btn-danger hang-up">
        Hang Up
      </button>
    </Link>
  );
};

export default HangupButton;
