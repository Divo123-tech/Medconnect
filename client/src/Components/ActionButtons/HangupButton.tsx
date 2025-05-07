import { Link } from "react-router";
import socketConnection from "../../utils/webrtcUtilities/socketConnection";
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
    <Link to="/dashboard">
      <button
        onClick={hangupCall}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors absolute top-5 right-2.5"
      >
        Hang Up
      </button>
    </Link>
  );
};

export default HangupButton;
