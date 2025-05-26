import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import CallerVideo from "./Components/VideoConference/CallerVideo";
import AnswerVideo from "./Components/VideoConference/AnswerVideo";
import Home from "./Components/Home";
import Register from "./Components/Auth/Register";
import LoginPage from "./Components/Auth/Login";
import MyProfile from "./Components/MyProfile";
import ProtectedRoute from "./Components/ProtectedRoute";
import BrowseDoctors from "./Components/BrowseDoctors";
import DoctorDetail from "./Components/DoctorDetail";
import PatientDetail from "./Components/PatientDetail";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Dashboard/Dashboard";
import BookAppointment from "./Components/BookAppointment";
import EditAppointment from "./Components/EditAppointment/EditAppointment";
import MyPatientsPage from "./Components/MyPatients";
import OAuthSuccess from "./Components/OAuthSuccess";

function App() {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
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
        <Route
          path="/my-profile"
          element={<ProtectedRoute element={<MyProfile />} />}
        />
        <Route path="/doctors" element={<BrowseDoctors />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
        <Route path="oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/patient/:id"
          element={
            <ProtectedRoute element={<PatientDetail />} checkDoctor={true} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <Dashboard
                  remoteStream={remoteStream}
                  setRemoteStream={setRemoteStream}
                />
              }
            />
          }
        />
        <Route
          path="/book-appointment"
          element={<ProtectedRoute element={<BookAppointment />} />}
        />
        <Route
          path="/edit-appointment/:id"
          element={<ProtectedRoute element={<EditAppointment />} />}
        />
        <Route path="/" Component={LandingPage} />
        <Route
          path="/dashboard/my-patients"
          element={<ProtectedRoute element={<MyPatientsPage />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
