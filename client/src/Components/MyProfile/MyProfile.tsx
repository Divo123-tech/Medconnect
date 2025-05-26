import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { useAuthStore } from "@/store/authStore";
import PatientProfile from "./PatientProfile";
import DoctorProfile from "./DoctorProfile";
import { isDoctor, isPatient } from "@/utils/typeGuards";
import ProtectedRoute from "../ProtectedRoute";

export default function ProfilePage() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <div className="flex items-center px-16 pt-2">
        <Link
          to="/dashboard"
          className="flex items-center text-teal-800 mr-4 text-lg hover:border-b hover:opacity-80"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </Link>
      </div>

      {user?.role == "PATIENT" && isPatient(user) && (
        <ProtectedRoute element={<PatientProfile user={user} />} />
      )}
      {user?.role == "DOCTOR" && isDoctor(user) && (
        <ProtectedRoute
          element={<DoctorProfile user={user} />}
          checkDoctor={true}
        />
      )}
    </div>
  );
}
