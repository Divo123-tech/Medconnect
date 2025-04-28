import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { getMyProfile } from "@/services/myProfileService";
import { useAuthStore } from "@/store/authStore";
import PatientProfile from "./PatientProfile";
import { Doctor } from "@/utils/types";
import DoctorProfile from "./DoctorProfile";
// Define the Patient type
type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  height: number;
  weight: number;
  bloodType: string;
  conditions: string;
  profilePictureURL: string;
};

export default function ProfilePage() {
  // Mock patient data - in a real app, this would come from your API
  const { user, setUser } = useAuthStore();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(token);
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };
    if (!user) {
      fetchProfile();
    }
  }, [setUser, token, user]);
  // Type guard function to check if user is a Patient
  function isPatient(user: Patient | Doctor): user is Patient {
    return (user as Patient).height !== undefined;
  }

  function isDoctor(user: Patient | Doctor): user is Doctor {
    return (user as Doctor).education !== undefined;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <div className="flex items-center px-16 pt-2">
        <Link
          to="/login"
          className="flex items-center text-teal-800 mr-4 text-lg hover:border-b hover:opacity-80"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </Link>
      </div>
      {user?.role == "PATIENT" && isPatient(user) && (
        <PatientProfile user={user} />
      )}
      {user?.role == "DOCTOR" && isDoctor(user) && (
        <DoctorProfile user={user} />
      )}
    </div>
  );
}
