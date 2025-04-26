import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import CallerVideo from "./Components/VideoConference/CallerVideo";
import AnswerVideo from "./Components/VideoConference/AnswerVideo";
import Home from "./Components/Home";
import Register from "./Components/Auth/Register";
import LoginPage from "./Components/Auth/Login";
import ProfilePage from "./Components/MyProfile";

function App() {
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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
