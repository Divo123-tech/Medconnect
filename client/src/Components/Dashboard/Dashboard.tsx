import { useAuthStore } from "@/store/authStore";
import PatientDashboard from "./PatientDashboard";
import { isDoctor, isPatient } from "@/utils/typeGuards";
import DoctorDashboard from "./DoctorDashboard/DoctorDashboard";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <>
      {user?.role == "PATIENT" && isPatient(user) && <PatientDashboard />}
      {user?.role == "DOCTOR" && isDoctor(user) && <DoctorDashboard />}
    </>
  );
};

export default Dashboard;
