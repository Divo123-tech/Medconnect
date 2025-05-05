import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  ClipboardCheck,
  Star,
  Video,
  User,
  Files,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

import { Link } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { getAppointmentsForDoctor } from "@/services/appointmentService";
import { Appointment } from "@/utils/types";
import PendingAppointments from "./PendingAppointments";
import ConfirmedAppointments from "./ConfirmedAppointments";
import CompletedAppointment from "./CompletedAppointment";

export default function DoctorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [patientWaiting, setPatientWaiting] = useState(true); // Set to true to show the waiting room by default
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
    []
  );
  const [confirmedAppointments, setConfirmedAppointments] = useState<
    Appointment[]
  >([]);
  const [completedAppointments, setCompletedAppointments] = useState<
    Appointment[]
  >([]);
  const { user, token } = useAuthStore();
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);
  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const result = await getAppointmentsForDoctor(token, "PENDING");
        console.log(result);
        setPendingAppointments(result.content);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchConfirmedAppointments = async () => {
      try {
        const result = await getAppointmentsForDoctor(token, "CONFIRMED");
        console.log(result);
        setConfirmedAppointments(result.content);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchCompletedAppointments = async () => {
      try {
        const result = await getAppointmentsForDoctor(token, "COMPLETED");
        console.log(result);
        setCompletedAppointments(result.content);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPendingAppointments();
    fetchCompletedAppointments();
    fetchConfirmedAppointments();
  }, [token]);
  // Format date as Day, Month Date
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Mock data for waiting patient
  const waitingPatient = {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "male",
    image: "/placeholder.svg?height=80&width=80",
    waitingSince: "2 minutes ago",
    appointmentType: "Annual Checkup",
    appointmentTime: "2:30 PM",
  };

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

  // Add this function to dismiss the waiting room notification
  const joinVideoCall = () => {
    // In a real app, this would initiate the video call
    setPatientWaiting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <header className="py-6 px-6 bg-white shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-center opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Welcome, Dr. {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">{formattedDate}, 2025</p>
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
                  Dr. {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden"
          >
            <Link to="/my-profile">
              <Button
                size="lg"
                className="cursor-pointer text-white w-full h-20 text-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none shadow-md"
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
            <Button
              size="lg"
              className="text-white w-full h-20 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-md"
            >
              <Files className="mr-2 h-5 w-5" />
              My Patients
            </Button>
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
        </motion.div>
        {/* Patient Waiting Room - New Section */}
        <AnimatePresence>
          {patientWaiting && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(16, 185, 129, 0.4)",
                    "0 0 20px rgba(16, 185, 129, 0.7)",
                    "0 0 0 rgba(16, 185, 129, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
                className="bg-gradient-to-r from-teal-50 to-green-50 border-l-4 border-teal-500 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white mr-3">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-teal-800">
                          Patient Waiting Room
                        </h2>
                        <p className="text-teal-600 text-sm">
                          A patient is waiting to join a video call with you
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="h-3 w-3 bg-green-500 rounded-full"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-teal-200">
                          <AvatarImage
                            src={waitingPatient.image || "/placeholder.svg"}
                            alt={waitingPatient.name}
                          />
                          <AvatarFallback>
                            {waitingPatient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                          className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <Video className="h-3 w-3" />
                        </motion.div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">
                          {waitingPatient.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {waitingPatient.age} years • {waitingPatient.gender}
                        </p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-teal-600 mr-1" />
                          <span className="text-xs text-teal-600">14:00</span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex-1 bg-white/60 rounded-md p-3 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Appointment:</span>
                        <span className="font-medium">
                          {waitingPatient.appointmentType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled Time:</span>
                        <span className="font-medium">
                          {waitingPatient.appointmentTime}
                        </span>
                      </div>
                    </div> */}

                    <div className="flex gap-2 ml-auto">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={joinVideoCall}
                          size="lg"
                          className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white shadow-lg"
                        >
                          <Video className="mr-2 h-5 w-5" />
                          Join Video Call Now
                        </Button>
                      </motion.div>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setPatientWaiting(false)}
                        className="border-teal-200 text-teal-700 hover:bg-teal-50"
                      >
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Today's Patients</h3>
                <Users className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">4</span>
                <span className="ml-1 text-sm opacity-80">appointments</span>
              </div>
              <div className="mt-2">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Patient Rating</h3>
                <Star className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">4.9</span>
                <span className="ml-1 text-sm opacity-80">out of 5</span>
              </div>
              <div className="mt-2">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pending Approvals</h3>
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">
                  {pendingAppointments.length}
                </span>
                <span className="ml-1 text-sm opacity-80">requests</span>
              </div>
              <div className="mt-2">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(pendingAppointments.length / 5) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.9 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
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

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6 bg-gradient-to-r from-teal-100 to-blue-100 p-1">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white"
              >
                Pending ({pendingAppointments.length})
              </TabsTrigger>
              <TabsTrigger
                value="confirmed"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
              >
                Confirmed ({confirmedAppointments.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white"
              >
                Completed ({completedAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {pendingAppointments.map((appointment) => (
                  <PendingAppointments
                    appointment={appointment}
                    key={appointment.id}
                  />
                ))}

                {pendingAppointments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No pending appointments to confirm.
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="confirmed">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {confirmedAppointments.map((appointment) => (
                  <ConfirmedAppointments
                    appointment={appointment}
                    key={appointment.id}
                  />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="completed">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {completedAppointments.map((appointment) => (
                  <CompletedAppointment
                    appointment={appointment}
                    key={appointment.id}
                  />
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
