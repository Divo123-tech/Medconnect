import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import CallerVideo from "./Components/CallerVideo";
import AnswerVideo from "./Components/AnswerVideo";
import Home from "./Components/Home";

function App() {
  //holds: callStatus, haveMedia, videoEnabled, audioEnabled,
  // haveOffer
  const [callStatus, setCallStatus] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [userOfferTo, setUserOfferTo] = useState("");
  const [offerData, setOfferData] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              callStatus={callStatus}
              userOfferTo={userOfferTo}
              setUserOfferTo={setUserOfferTo}
              setCallStatus={setCallStatus}
              localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              setPeerConnection={setPeerConnection}
              offerData={offerData}
              setOfferData={setOfferData}
            />
          }
        />
        <Route
          path="/offer"
          element={
            <CallerVideo
              userOfferTo={userOfferTo}
              callStatus={callStatus}
              setCallStatus={setCallStatus}
              localStream={localStream}
              remoteStream={remoteStream}
              peerConnection={peerConnection}
            />
          }
        />
        <Route
          path="/answer"
          element={
            <AnswerVideo
              callStatus={callStatus}
              setCallStatus={setCallStatus}
              localStream={localStream}
              remoteStream={remoteStream}
              peerConnection={peerConnection}
              offerData={offerData}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
