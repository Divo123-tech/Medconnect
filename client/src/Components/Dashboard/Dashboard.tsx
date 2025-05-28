import { useAuthStore } from "@/store/authStore";
import PatientDashboard from "./PatientDashboard";
import { isDoctor, isPatient } from "@/utils/typeGuards";
import DoctorDashboard from "./DoctorDashboard/DoctorDashboard";
import ProfileBadge from "../ProfileBadge";
import { Button } from "../ui/button";
import { Stethoscope } from "lucide-react";
import ProtectedRoute from "../ProtectedRoute";
type Props = {
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
};
const Dashboard = ({ remoteStream, setRemoteStream }: Props) => {
  const { user, setUser, setToken } = useAuthStore();

  const logout = () => {
    setUser(null);
    setToken(null);
  };
  return (
    <>
      <header className="py-4 lg:px-8 bg-white shadow-sm relative overflow-hidden">
        <div className="mx-auto relative w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white mr-2">
                    <Stethoscope size={24} />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                    MedConnect
                  </span>
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <ProfileBadge />
              <Button
                size="lg"
                variant="outline"
                onClick={logout}
                className="border-red-400 text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      {user?.role == "PATIENT" && isPatient(user) && (
        // <ProtectedRoute
        //   element={
        //     <PatientDashboard
        //       remoteStream={remoteStream}
        //       setRemoteStream={setRemoteStream}
        //     />
        //   }
        // />
        <PatientDashboard
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
        />
      )}
      {user?.role == "DOCTOR" && isDoctor(user) && (
        <ProtectedRoute
          element={
            <DoctorDashboard
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
            />
          }
          checkDoctor={true}
        />
      )}
    </>
  );
};

export default Dashboard;
