import { useCallStore } from "../../store/webrtcStore";
import { useAuthStore } from "@/store/authStore";
import socketConnection from "../../utils/webrtcUtilities/socketConnection";

const HangupButton = () => {
  const { callStatus, peerConnection } = useCallStore();
  const { user } = useAuthStore();

  const hangupCall = () => {
    if (peerConnection) {
      const socket = socketConnection(user?.email || "");
      socket?.emit("hangup", user?.email || "");
    }

    // Reload to clean up the socket connection
    window.location.reload();
  };

  if (callStatus.current === "complete") {
    return null;
  }

  return (
    <button
      onClick={hangupCall}
      className="absolute top-5 right-2.5 rounded-sm px-4 py-2 bg-red-600 text-white flex items-center justify-center 
        hover:bg-red-700 hover:shadow-lg transition-all duration-200 active:scale-90 group"
    >
      <i className="fa fa-phone-slash text-[20px] group-hover:rotate-[20deg] transition-transform duration-200 pr-2" />
      End Call
    </button>
  );
};

export default HangupButton;
