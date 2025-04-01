import { Link, useNavigate } from "react-router";
const HangupButton = ({
  remoteFeedEl,
  localFeedEl,
  peerConnection,
  callStatus,
  setCallStatus,
}) => {
  const navigate = useNavigate();
  const hangupCall = () => {
    console.log("Before Func");
    if (peerConnection) {
      console.log("begining of func");
      const copyCallStatus = { ...callStatus };
      copyCallStatus.current = "complete";
      //user has clicked hang up. pc:
      //close it
      //remove listeners
      //set it to null
      peerConnection.close();
      peerConnection.onicecandidate = null;
      peerConnection.onaddstream = null;
      peerConnection = null;

      //set both video tags to empty
      localFeedEl.current.srcObject = null;
      remoteFeedEl.current.srcObject = null;
      console.log("end of func");
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
