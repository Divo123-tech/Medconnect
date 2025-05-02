"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Plus,
  Stethoscope,
  User,
  Video,
  CheckCircle,
  Bell,
  Heart,
  Activity,
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

// Types for our data
type AppointmentStatus = "pending" | "confirmed" | "cancelled";

interface Appointment {
  id: number;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: "in-person" | "video";
  notes?: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  available: string;
  bgColor: string;
}

export default function PatientDashboard() {
  const [activeDoctor, setActiveDoctor] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Mock data for appointments
  const appointments: Appointment[] = [
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiologist",
      doctorImage: "/placeholder.svg?height=80&width=80",
      date: "Today",
      time: "2:30 PM",
      status: "confirmed",
      type: "video",
      notes:
        "Annual heart checkup. Please have your recent test results ready.",
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      doctorSpecialty: "Dermatologist",
      doctorImage: "/placeholder.svg?height=80&width=80",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "pending",
      type: "in-person",
    },
    {
      id: 4,
      doctorName: "Dr. James Wilson",
      doctorSpecialty: "Psychiatrist",
      doctorImage: "/placeholder.svg?height=80&width=80",
      date: "May 22, 2023",
      time: "1:00 PM",
      status: "confirmed",
      type: "in-person",
    },
  ];

  // Mock data for doctors
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
      available: "Today",
      bgColor: "from-red-400 to-red-500",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.8,
      available: "Tomorrow",
      bgColor: "from-blue-400 to-blue-500",
    },
    {
      id: 3,
      name: "Dr. Emily Taylor",
      specialty: "Neurologist",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
      available: "May 20",
      bgColor: "from-purple-400 to-purple-500",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Psychiatrist",
      image: "/placeholder.svg?height=80&width=80",
      rating: 4.6,
      available: "Today",
      bgColor: "from-green-400 to-green-500",
    },
  ];

  // Filter appointments by status
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <header className="py-6 px-6 bg-white shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-center opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Patient Dashboard
              </h1>
              <p className="text-gray-600">
                {formattedDate} • {formattedTime}
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                    alt="John Doe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
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
                <p className="font-medium text-gray-900">Welcome, John</p>
                <p className="text-xs text-gray-500">Patient ID: #12345</p>
              </div>
            </div>
          </div>
        </div>
      </header>

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
            <Button
              size="lg"
              className="w-full h-20 text-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-none shadow-md"
            >
              <User className="mr-2 h-5 w-5" />
              Edit Profile
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
              className="w-full h-20 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-md"
            >
              <Plus className="mr-2 h-5 w-5" />
              Book New Appointment
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

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden"
          >
            <Button
              size="lg"
              className="w-full h-20 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none shadow-md"
            >
              <Stethoscope className="mr-2 h-5 w-5" />
              Browse Doctors
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
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Health Stats */}
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
                <h3 className="font-medium">Heart Rate</h3>
                <Heart className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">72</span>
                <span className="ml-1 text-sm opacity-80">bpm</span>
              </div>
              <div className="mt-2">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
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
                <h3 className="font-medium">Blood Pressure</h3>
                <Activity className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">120/80</span>
                <span className="ml-1 text-sm opacity-80">mmHg</span>
              </div>
              <div className="mt-2">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
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
                <h3 className="font-medium">Next Checkup</h3>
                <Calendar className="h-5 w-5" />
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">3</span>
                <span className="ml-1 text-sm opacity-80">days</span>
              </div>
              <div className="mt-2">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
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
            </TabsList>

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
                    <Card className="overflow-hidden border-teal-100 hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-2 bg-gradient-to-r from-teal-50 to-blue-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="h-12 w-12 mr-3 border-2 border-teal-200">
                                <AvatarImage
                                  src={
                                    appointment.doctorImage ||
                                    "/placeholder.svg"
                                  }
                                  alt={appointment.doctorName}
                                />
                                <AvatarFallback>
                                  {appointment.doctorName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {appointment.type === "video" && (
                                <motion.div
                                  variants={pulseVariants}
                                  animate="pulse"
                                  className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                  <Video className="h-3 w-3" />
                                </motion.div>
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {appointment.doctorName}
                              </CardTitle>
                              <p className="text-gray-500">
                                {appointment.doctorSpecialty}
                              </p>
                            </div>
                          </div>
                          {renderStatusBadge(appointment.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-teal-600" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1 text-teal-600" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            {appointment.type === "video" ? (
                              <>
                                <Video className="h-4 w-4 mr-1 text-teal-600" />
                                Video Call
                              </>
                            ) : (
                              <>
                                <svg
                                  className="h-4 w-4 mr-1 text-teal-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                In-Person
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex justify-end w-full">
                          {appointment.type === "video" ? (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md">
                                <Video className="mr-2 h-4 w-4" />
                                Join Video Call
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md">
                                Get Directions
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

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
                    <Card className="overflow-hidden border-amber-100 hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-3 border-2 border-amber-200">
                              <AvatarImage
                                src={
                                  appointment.doctorImage || "/placeholder.svg"
                                }
                                alt={appointment.doctorName}
                              />
                              <AvatarFallback>
                                {appointment.doctorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">
                                {appointment.doctorName}
                              </CardTitle>
                              <p className="text-gray-500">
                                {appointment.doctorSpecialty}
                              </p>
                            </div>
                          </div>
                          {renderStatusBadge(appointment.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-amber-600" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1 text-amber-600" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-gray-600">
                            {appointment.type === "video" ? (
                              <>
                                <Video className="h-4 w-4 mr-1 text-amber-600" />
                                Video Call
                              </>
                            ) : (
                              <>
                                <svg
                                  className="h-4 w-4 mr-1 text-amber-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                In-Person
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex justify-end w-full gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md">
                              Confirm
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

        {/* Doctors Section */}
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
              className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white mr-3"
            >
              <Stethoscope className="h-5 w-5" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Available Doctors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setActiveDoctor(doctor.id)}
                onHoverEnd={() => setActiveDoctor(null)}
                className="relative"
              >
                <Card className="overflow-hidden border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div
                    className={`h-3 bg-gradient-to-r ${doctor.bgColor}`}
                  ></div>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-3">
                      <div className="relative">
                        <Avatar className="h-14 w-14 mr-3 border-2 border-gray-200">
                          <AvatarImage
                            src={doctor.image || "/placeholder.svg"}
                            alt={doctor.name}
                          />
                          <AvatarFallback>
                            {doctor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {activeDoctor === doctor.id && (
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
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(doctor.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        {doctor.rating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge
                        className={`${
                          doctor.available === "Today"
                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                            : doctor.available === "Tomorrow"
                            ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                        }`}
                      >
                        Available {doctor.available}
                      </Badge>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className={`bg-gradient-to-r ${doctor.bgColor} text-white shadow-md`}
                        >
                          Book Now
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                {/* Animated pulse when hovered */}
                {activeDoctor === doctor.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -z-10 inset-0 bg-gradient-to-r from-purple-200/50 to-blue-200/50 rounded-xl blur-xl"
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

          {/* View More Doctors Button */}
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
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-md">
                View All Doctors
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
