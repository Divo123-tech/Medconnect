import { useRef } from "react";
import HangupButton from "./HangupButton";
import VideoButton from "./VideoButton";
import AudioButton from "./AudioButton";

const ActionButtons = ({ localFeedEl, remoteFeedEl }) => {
  // const callStatus = useSelector(state=>state.callStatus);

  const menuButtons = useRef(null);
  return (
    <div id="menu-buttons" ref={menuButtons} className="row">
      <div className="left col-6">
        <AudioButton />
        <VideoButton />
      </div>
      <div className="center justify-center text-end col-2 hangup-wrapper">
        <HangupButton localFeedEl={localFeedEl} remoteFeedEl={remoteFeedEl} />
      </div>
    </div>
  );
};

export default ActionButtons;
