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
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router";
import ConfirmedAppointments from "./ConfirmedAppointments";

// Types for our data
type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

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


export default function PatientDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuthStore();
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
      type: "video",
    },
    {
      id: 4,
      doctorName: "Dr. James Wilson",
      doctorSpecialty: "Psychiatrist",
      doctorImage: "/placeholder.svg?height=80&width=80",
      date: "May 22, 2023",
      time: "1:00 PM",
      status: "confirmed",
      type: "video",
    },
  ];

  // Add completed appointments to the mock data after the existing appointments array
  const completedAppointments: Appointment[] = [
    {
      id: 5,
      doctorName: "Dr. Emily Taylor",
      doctorSpecialty: "Neurologist",
      doctorImage: "/placeholder.svg?height=80&width=80",
      date: "May 1, 2023",
      time: "9:15 AM",
      status: "completed",
      type: "video",
      notes:
        "Follow-up on migraine treatment. Medication seems to be working well.",
    },
    {
      id: 6,
      doctorName: "Dr. Robert Kim",
      doctorSpecialty: "Ophthalmologist",
      doctorImage: "/placeholder.svg?height=80&width=80",
      date: "April 22, 2023",
      time: "11:30 AM",
      status: "completed",
      type: "video",
      notes: "Annual eye examination. Prescription updated.",
    },
    {
      id: 7,
      doctorName: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiologist",
      doctorImage: "/placeholder.svg?height=80&width=80",
      date: "April 15, 2023",
      time: "2:00 PM",
      status: "completed",
      type: "video",
      notes: "Routine heart checkup. All tests normal.",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <header className="py-6 px-6 bg-white shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-center opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Welcome, John Pork
              </h1>
              <p className="text-gray-600">{formattedDate} 2025</p>
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
                <p className="font-medium text-gray-900">John Pork</p>
                <p className="text-xs text-gray-500">JohnPork@gmail.com</p>
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
                {confirmedAppointments.map((appointment) => (
                  <ConfirmedAppointments
                    appointment={appointment}
                    key={appointment.id}
                  />
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
                    <Card className="overflow-hidden border-amber-100 hover:shadow-lg transition-all duration-300 pt-0">
                      <CardHeader className="py-4 bg-gradient-to-r from-amber-50 to-orange-50">
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
                            <Video className="h-4 w-4 mr-1 text-amber-600" />
                            Video Call
                          </div>
                        </div>
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
                              Cancel
                            </Button>
                          </motion.div>
                          <div className="flex gap-2">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md">
                                Edit
                              </Button>
                            </motion.div>
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
                      <CardHeader className="py-4 bg-gradient-to-r from-gray-100 to-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-3 border-2 border-gray-200">
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
                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-100">
                            <p className="font-medium text-gray-700 mb-1">
                              Doctor's Notes:
                            </p>
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2">
                        <div className="flex justify-between w-full">
                          <div></div>
                          <div className="flex gap-2">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button className="bg-gradient-to-r text-white from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-md">
                                Book Follow-up
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
