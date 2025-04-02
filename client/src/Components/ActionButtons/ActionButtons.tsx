import { useRef } from "react";
import HangupButton from "./HangupButton";
import VideoButton from "./VideoButton";
import AudioButton from "./AudioButton";

const ActionButtons = ({
  callStatus,
  localFeedEl,
  remoteFeedEl,
  updateCallStatus,
  localStream,
  peerConnection,
}) => {
  // const callStatus = useSelector(state=>state.callStatus);
  const menuButtons = useRef(null);

  return (
    <div id="menu-buttons" ref={menuButtons} className="row">
      <div className="left col-6">
        <AudioButton
          callStatus={callStatus}
          setCallStatus={updateCallStatus}
          localStream={localStream}
          peerConnection={peerConnection}
        />
        <VideoButton
          localFeedEl={localFeedEl}
          callStatus={callStatus}
          localStream={localStream}
          updateCallStatus={updateCallStatus}
          peerConnection={peerConnection}
        />
      </div>
      <div className="center justify-center text-end col-2 hangup-wrapper">
        <HangupButton
          localStream={localStream}
          localFeedEl={localFeedEl}
          remoteFeedEl={remoteFeedEl}
          peerConnection={peerConnection}
          callStatus={callStatus}
          setCallStatus={updateCallStatus}
        />
      </div>
    </div>
  );
};

export default ActionButtons;
