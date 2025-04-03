import { Link } from "react-router";
import socketConnection from "../../webrtcUtilities/socketConnection";
const HangupButton = ({
  remoteFeedEl,
  localFeedEl,
  peerConnection,
  callStatus,
  setCallStatus,
  localStream,
  username,
}) => {
  const hangupCall = () => {
    console.log("Before Func");
    if (peerConnection) {
      console.log("begining of func");
      setCallStatus((prevCallStatus) => {
        prevCallStatus.current = "complete";
        return prevCallStatus;
      });
      const socket = socketConnection("");
      socket.emit("hangupFromAnswerer", username);
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
      console.log("end of func");
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          if (track.kind === "video") {
            track.stop();
          }
        });
      }
    }
    console.log("after func");
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
