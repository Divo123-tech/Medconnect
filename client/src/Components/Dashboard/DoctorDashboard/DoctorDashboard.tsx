import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  ClipboardCheck,
  CheckCircle,
  Bell,
  Star,
  User,
  MoreHorizontal,
  Video,
  XCircle,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link } from "react-router";

// Types for our data
type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Appointment {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  patientImage: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: "video";
  reason?: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  image: string;
  lastVisit: string;
  condition: string;
  status: "active" | "new" | "returning";
}

export default function DoctorDashboard() {
  const [activePatient, setActivePatient] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [patientWaiting, setPatientWaiting] = useState(true); // Set to true to show the waiting room by default

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM AM/PM
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

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

  // Mock data for appointments
  const appointments: Appointment[] = [
    {
      id: 1,
      patientName: "John Doe",
      patientAge: 45,
      patientGender: "male",
      patientImage: "/placeholder.svg?height=80&width=80",
      date: "Today",
      time: "2:30 PM",
      status: "confirmed",
      type: "video",
      reason: "Annual heart checkup. Patient reports occasional chest pain.",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientAge: 32,
      patientGender: "female",
      patientImage: "/placeholder.svg?height=80&width=80",
      date: "Today",
      time: "4:00 PM",
      status: "pending",
      type: "video",
      reason: "Follow-up on medication. Patient reports improved symptoms.",
    },
    {
      id: 3,
      patientName: "Michael Brown",
      patientAge: 28,
      patientGender: "male",
      patientImage: "/placeholder.svg?height=80&width=80",
      date: "Tomorrow",
      time: "10:15 AM",
      status: "pending",
      type: "video",
      reason:
        "First consultation. Patient reports persistent headaches for the past month.",
    },
    {
      id: 4,
      patientName: "Sarah Wilson",
      patientAge: 56,
      patientGender: "female",
      patientImage: "/placeholder.svg?height=80&width=80",
      date: "Tomorrow",
      time: "1:45 PM",
      status: "confirmed",
      type: "video",
      reason: "Discussing test results from last week's blood work.",
    },
    {
      id: 5,
      patientName: "Robert Johnson",
      patientAge: 62,
      patientGender: "male",
      patientImage: "/placeholder.svg?height=80&width=80",
      date: "May 20, 2023",
      time: "11:00 AM",
      status: "completed",
      type: "video",
      reason:
        "Follow-up on heart condition. Medication adjusted, patient responding well.",
    },
    {
      id: 6,
      patientName: "Emily Davis",
      patientAge: 41,
      patientGender: "female",
      patientImage: "/placeholder.svg?height=80&width=80",
      date: "May 18, 2023",
      time: "9:30 AM",
      status: "completed",
      type: "video",
      reason:
        "Annual check-up. All vitals normal, minor concerns about diet addressed.",
    },
    {
      id: 7,
      patientName: "David Miller",
      patientAge: 35,
      patientGender: "male",
      patientImage: "/placeholder.svg?height=80&width=80",
      date: "May 15, 2023",
      time: "3:15 PM",
      status: "completed",
      type: "video",
      reason:
        "Consultation for recurring migraines. Prescribed new medication for trial.",
    },
  ];

  // Mock data for patients
  const patients: Patient[] = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      gender: "male",
      image: "/placeholder.svg?height=80&width=80",
      lastVisit: "1 week ago",
      condition: "Hypertension",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      gender: "female",
      image: "/placeholder.svg?height=80&width=80",
      lastVisit: "2 weeks ago",
      condition: "Asthma",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Brown",
      age: 28,
      gender: "male",
      image: "/placeholder.svg?height=80&width=80",
      lastVisit: "Never",
      condition: "Headaches",
      status: "new",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      age: 56,
      gender: "female",
      image: "/placeholder.svg?height=80&width=80",
      lastVisit: "1 month ago",
      condition: "Diabetes",
      status: "active",
    },
  ];

  // Filter appointments by status
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  );

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Function to render appointment status badge
  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600">
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to render patient status badge
  const renderPatientStatusBadge = (status: Patient["status"]) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
            New
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white">
            Active
          </Badge>
        );
      case "returning":
        return (
          <Badge className="bg-gradient-to-r from-purple-400 to-purple-500 text-white">
            Returning
          </Badge>
        );
      default:
        return null;
    }
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
                Doctor Dashboard
              </h1>
              <p className="text-gray-600">
                {formattedDate} • {formattedTime}
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
                <p className="font-medium text-gray-900">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Cardiologist</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
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
                          <span className="text-xs text-teal-600">
                            Waiting since {waitingPatient.waitingSince}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 bg-white/60 rounded-md p-3 text-sm">
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
                    </div>

                    <div className="flex gap-2">
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
                  <motion.div
                    key={appointment.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden border-amber-100 hover:shadow-lg transition-all duration-300 pt-0">
                      <CardHeader className="py-4 bg-gradient-to-r from-amber-50 to-orange-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-3 border-2 border-amber-200">
                              <AvatarImage
                                src={
                                  appointment.patientImage || "/placeholder.svg"
                                }
                                alt={appointment.patientName}
                              />
                              <AvatarFallback>
                                {appointment.patientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">
                                {appointment.patientName}
                              </CardTitle>
                              <p className="text-gray-500">
                                {appointment.patientAge} years •{" "}
                                {appointment.patientGender}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-amber-600" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1 text-amber-600" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Video className="h-4 w-4 mr-1 text-amber-600" />
                            Video Call
                          </div>
                        </div>

                        {appointment.reason && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-md text-sm text-gray-600 border border-amber-100">
                            <p className="font-medium text-amber-700 mb-1">
                              Patient's Reason:
                            </p>
                            <p>{appointment.reason}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex justify-between w-full">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Decline
                            </Button>
                          </motion.div>
                          <div className="flex gap-2">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirm Appointment
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
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
                  <motion.div
                    key={appointment.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden border-teal-100 hover:shadow-lg transition-all duration-300 pt-0">
                      <CardHeader className="py-4 bg-gradient-to-r from-teal-50 to-blue-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-12 w-12 mr-3 border-2 border-teal-200">
                                <AvatarImage
                                  src={
                                    appointment.patientImage ||
                                    "/placeholder.svg"
                                  }
                                  alt={appointment.patientName}
                                />
                                <AvatarFallback>
                                  {appointment.patientName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {appointment.patientName}
                              </CardTitle>
                              <p className="text-gray-500">
                                {appointment.patientAge} years •{" "}
                                {appointment.patientGender}
                              </p>
                            </div>
                          </div>
                          {renderStatusBadge(appointment.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-teal-600" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1 text-teal-600" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Video className="h-4 w-4 mr-1 text-teal-600" />
                            Video Call
                          </div>
                        </div>

                        {appointment.reason && (
                          <div className="mt-3 p-3 bg-teal-50 rounded-md text-sm text-gray-600 border border-teal-100">
                            <p className="font-medium text-teal-700 mb-1">
                              Patient's Reason:
                            </p>
                            <p>{appointment.reason}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex justify-between w-full">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              className="border-gray-200 hover:bg-gray-50"
                            >
                              <User className="mr-2 h-4 w-4" />
                              View Patient Info
                            </Button>
                          </motion.div>
                          <div className="flex gap-2">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md">
                                <Video className="mr-2 h-4 w-4" />
                                Join Video Call
                              </Button>
                            </motion.div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white"
                              >
                                <DropdownMenuItem className="cursor-pointer">
                                  Reschedule Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600">
                                  Cancel Appointment
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
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
                  <motion.div
                    key={appointment.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300 pt-0">
                      <CardHeader className="py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-3 border-2 border-gray-200">
                              <AvatarImage
                                src={
                                  appointment.patientImage || "/placeholder.svg"
                                }
                                alt={appointment.patientName}
                              />
                              <AvatarFallback>
                                {appointment.patientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">
                                {appointment.patientName}
                              </CardTitle>
                              <p className="text-gray-500">
                                {appointment.patientAge} years •{" "}
                                {appointment.patientGender}
                              </p>
                            </div>
                          </div>
                          {renderStatusBadge(appointment.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Video className="h-4 w-4 mr-1 text-gray-500" />
                            Video Call
                          </div>
                        </div>
                        {appointment.reason && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-100">
                            <p className="font-medium text-gray-700 mb-1">
                              Notes:
                            </p>
                            <p>{appointment.reason}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex justify-between w-full">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              className="border-gray-200 hover:bg-gray-50"
                            >
                              <User className="mr-2 h-4 w-4" />
                              View Patient Info
                            </Button>
                          </motion.div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Patients Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
              className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white mr-3"
            >
              <Users className="h-5 w-5" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Patients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {patients.map((patient) => (
              <motion.div
                key={patient.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setActivePatient(patient.id)}
                onHoverEnd={() => setActivePatient(null)}
                className="relative"
              >
                <Card className="overflow-hidden border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div
                    className={`h-2 ${
                      patient.status === "new"
                        ? "bg-gradient-to-r from-blue-400 to-blue-500"
                        : patient.status === "returning"
                        ? "bg-gradient-to-r from-purple-400 to-purple-500"
                        : "bg-gradient-to-r from-teal-400 to-teal-500"
                    }`}
                  ></div>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-3">
                      <div className="relative">
                        <Avatar className="h-14 w-14 mr-3 border-2 border-gray-200">
                          <AvatarImage
                            src={patient.image || "/placeholder.svg"}
                            alt={patient.name}
                          />
                          <AvatarFallback>
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {activePatient === patient.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1 -top-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </motion.div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {patient.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {patient.age} years • {patient.gender}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Visit:</span>
                        <span className="font-medium">{patient.lastVisit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Condition:</span>
                        <span className="font-medium">{patient.condition}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      {renderPatientStatusBadge(patient.status)}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                        >
                          View Records
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                {/* Animated pulse when hovered */}
                {activePatient === patient.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-200/50 to-teal-200/50 rounded-xl blur-xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="w-full h-full"
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* View More Patients Button */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md">
                View All Patients
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
