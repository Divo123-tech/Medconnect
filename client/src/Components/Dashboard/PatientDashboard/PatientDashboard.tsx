import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Stethoscope,
  User,
  CheckCircle,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router";
import { getAppointments } from "@/services/appointmentService";
import { Appointment } from "@/utils/types";
import CompletedAppointment from "./CompletedAppointment";
import PendingAppointment from "./PendingAppointment";
import ConfirmedAppointment from "./ConfirmedAppointment";
type Props = {
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
};
export default function PatientDashboard({
  remoteStream,
  setRemoteStream,
}: Props) {
  const { token } = useAuthStore();
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
    []
  );
  const [confirmedAppointments, setConfirmedAppointments] = useState<
    Appointment[]
  >([]);
  const [completedAppointments, setCompletedAppointments] = useState<
    Appointment[]
  >([]);

  const fetchAllAppointments = useCallback(async () => {
    try {
      const [pending, confirmed, completed] = await Promise.all([
        getAppointments(token, "PENDING"),
        getAppointments(token, "CONFIRMED"),
        getAppointments(token, "COMPLETED"),
      ]);

      setPendingAppointments(pending.content);
      setConfirmedAppointments(confirmed.content);
      setCompletedAppointments(completed.content);

      console.log({ pending, confirmed, completed });
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  }, [token]);
  useEffect(() => {
    if (token) fetchAllAppointments();
  }, [fetchAllAppointments, token]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden"
          >
            <Link to="/my-profile">
              <Button
                size="lg"
                className="w-full cursor-pointer text-white h-20 text-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none shadow-md"
              >
                <User className="mr-2 h-5 w-5" />
                Edit Profile
              </Button>
            </Link>
            <motion.div
              className="absolute -top-6 -right-6 w-12 h-12 bg-white/10 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden"
          >
            <Link to="/book-appointment">
              <Button
                size="lg"
                className="w-full cursor-pointer text-white h-20 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-md"
              >
                <Plus className="mr-2 h-5 w-5" />
                Book New Appointment
              </Button>
            </Link>
            <motion.div
              className="absolute -top-6 -right-6 w-12 h-12 bg-white/10 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5,
              }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden"
          >
            <Link to={"/doctors"}>
              <Button
                size="lg"
                className="w-full cursor-pointer h-20 text-white text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none shadow-md"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                Browse Doctors
              </Button>
            </Link>
            <motion.div
              className="absolute -top-6 -right-6 w-12 h-12 bg-white/10 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Appointments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center text-white mr-3"
            >
              <Calendar className="h-5 w-5" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Your Appointments
            </h2>
          </div>

          <Tabs defaultValue="confirmed" className="w-full">
            <TabsList className="mb-6 bg-gradient-to-r from-teal-100 to-blue-100 p-1">
              <TabsTrigger
                value="confirmed"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
              >
                Confirmed ({confirmedAppointments.length})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white"
              >
                Pending ({pendingAppointments.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white"
              >
                Completed ({completedAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="confirmed">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {confirmedAppointments.length > 0 ? (
                  confirmedAppointments.map((appointment) => (
                    <ConfirmedAppointment
                      appointment={appointment}
                      key={appointment.id}
                      remoteStream={remoteStream}
                      setRemoteStream={setRemoteStream}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center text-center py-16 text-teal-600"
                  >
                    <div className="bg-teal-50 p-6 rounded-full shadow-inner mb-6">
                      <CheckCircle className="h-10 w-10 text-teal-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      No Confirmed Appointments
                    </h2>
                    <p className="text-sm text-teal-500 max-w-xs">
                      Once a doctor confirms your appointments, they’ll appear
                      here.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="pending">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {pendingAppointments.length > 0 ? (
                  pendingAppointments.map((appointment) => (
                    <PendingAppointment
                      appointment={appointment}
                      key={appointment.id}
                      onStatusChange={fetchAllAppointments}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center text-center py-16 text-amber-600"
                  >
                    <div className="bg-amber-100 p-6 rounded-full shadow-inner mb-6">
                      <CalendarPlus className="h-10 w-10 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      No Pending Appointments
                    </h2>
                    <p className="text-sm text-amber-500 max-w-xs">
                      You don’t have any appointments pending. Book an
                      appointment to get started.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="completed">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {completedAppointments.length > 0 ? (
                  completedAppointments.map((appointment) => (
                    <CompletedAppointment
                      appointment={appointment}
                      key={appointment.id}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center text-center py-16 text-gray-500"
                  >
                    <div className="bg-gray-100 p-6 rounded-full shadow-inner mb-6">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      No Completed Appointments
                    </h2>
                    <p className="text-sm text-gray-400 max-w-xs">
                      Once you complete appointments with doctors, you'll see
                      them listed here.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
