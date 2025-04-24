import { useRef } from "react";
import HangupButton from "./HangupButton";
import VideoButton from "./VideoButton";
import AudioButton from "./AudioButton";

const ActionButtons = () => {
  const menuButtons = useRef(null);
  return (
    <div
      id="menu-buttons"
      ref={menuButtons}
      className="flex flex-wrap h-[80px] w-full bg-[#333] absolute bottom-[-6px]"
    >
      <div className="w-full md:w-1/2 flex gap-4">
        <AudioButton />
        <VideoButton />
      </div>

      <div className="w-full md:w-1/6 flex justify-center md:justify-end">
        <HangupButton />
      </div>
    </div>
  );
};

export default ActionButtons;
