import { useAuthStore } from "@/store/authStore";
import PatientDashboard from "./PatientDashboard";
import { isDoctor, isPatient } from "@/utils/typeGuards";
import DoctorDashboard from "./DoctorDashboard/DoctorDashboard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
type Props = {
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
};
const Dashboard = ({ remoteStream, setRemoteStream }: Props) => {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);
  // Format date as Day, Month Date
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <>
      <header className="py-6 px-6 bg-white shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-center opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Welcome, {user?.role == "DOCTOR" && "Dr."} {user?.firstName}{" "}
                {user?.lastName}
              </h1>
              <p className="text-gray-600">
                {formattedDate}, {currentTime.getFullYear()}
              </p>
            </div>
            <Link
              to="/my-profile"
              className="flex items-center gap-3 hover:opacity-60"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="relative"
              >
                <Avatar className="h-10 w-10 border-2 border-teal-200">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="Dr. Sarah Johnson"
                  />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              </motion.div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.role == "DOCTOR" && "Dr."} {user?.firstName}{" "}
                  {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </Link>
          </div>
        </div>
      </header>
      {user?.role == "PATIENT" && isPatient(user) && (
        <PatientDashboard
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
        />
      )}
      {user?.role == "DOCTOR" && isDoctor(user) && (
        <DoctorDashboard
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
        />
      )}
    </>
  );
};

export default Dashboard;
