import socketConnection from "../../utils/webrtcUtilities/socketConnection";
import { useCallStore } from "../../store/webrtcStore";
import { useAuthStore } from "@/store/authStore";

const HangupButton = () => {
  const { callStatus, peerConnection } = useCallStore();
  const { user } = useAuthStore();
  const hangupCall = () => {
    if (peerConnection) {
      const socket = socketConnection(user?.email || "");
      socket?.emit("hangup", user?.email || "");
    }
    //reload to clean up socket
    window.location.reload();
  };

  if (callStatus.current === "complete") {
    return <></>;
  }

  return (
    <button
      onClick={hangupCall}
      className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors absolute top-5 right-2.5"
    >
      Hang Up
    </button>
  );
};

export default HangupButton;
