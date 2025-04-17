import { Link } from "react-router";
import socketConnection from "../../webrtcUtilities/socketConnection";
import { useCallStore } from "../../store/webrtcStore";

const HangupButton = () => {
  const { username, callStatus, peerConnection } = useCallStore();
  const hangupCall = () => {
    if (peerConnection) {
      const socket = socketConnection(username);
      socket?.emit("hangup", username);
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
