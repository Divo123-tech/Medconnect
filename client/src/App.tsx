import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import CallerVideo from "./Components/CallerVideo";
import AnswerVideo from "./Components/AnswerVideo";
import Home from "./Components/Home";

function App() {
  //holds: callStatus, haveMedia, videoEnabled, audioEnabled,
  // haveOffer
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
            />
          }
        />
        <Route
          path="/offer"
          element={<CallerVideo remoteStream={remoteStream} />}
        />
        <Route
          path="/answer"
          element={<AnswerVideo remoteStream={remoteStream} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
