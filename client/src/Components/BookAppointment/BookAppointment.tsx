import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Avatar } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/Components/ui/button";
import { Doctor } from "@/utils/types";
import { getDoctors } from "@/services/doctorService";
import { createAppointment } from "@/services/appointmentService";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";

// Generate time slots from 9am to 5pm in 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    const hourStr = hour.toString().padStart(2, "0");
    slots.push(`${hourStr}:00`);
    slots.push(`${hourStr}:30`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const { token } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctorsData = async () => {
      setDoctors([]);
      try {
        const data = await getDoctors({
          page: currentPage - 1,
          size: 5,
          name: searchTerm.trim(),
        });

        setDoctors(data.content);
        setTotalPages(data.totalPages);
        console.log(data.content);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctorsData();
  }, [currentPage, searchTerm]);

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit appointment
      setIsSubmitting(true);
      try {
        await createAppointment(
          token,
          selectedDoctor?.id,
          selectedDate?.toISOString().split("T")[0],
          selectedTime,
          notes
        );
        setIsComplete(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (err) {
        setIsSubmitting(false);
        console.log(err);
      }

      //   setTimeout(() => {
      //     setIsSubmitting(false);
      //     setIsComplete(true);
      //     setTimeout(() => {
      //       window.location.href = "/dashboard";
      //     }, 2000);
      //   }, 1500);
    }
    console.log("doctor", selectedDoctor);
    console.log("date", selectedDate);
    console.log("time", selectedTime);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !selectedDoctor;
      case 2:
        return !selectedDate;
      case 3:
        return !selectedTime;
      default:
        return false;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Step indicators
  const steps = [
    { number: 1, title: "Select Doctor", icon: <Search className="h-5 w-5" /> },
    { number: 2, title: "Choose Date", icon: <Calendar className="h-5 w-5" /> },
    { number: 3, title: "Select Time", icon: <Clock className="h-5 w-5" /> },
    { number: 4, title: "Add Notes", icon: <FileText className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-600">
            Schedule a video consultation with our specialists
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            {steps.map((s) => (
              <motion.div
                key={s.number}
                className="flex flex-col items-center"
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: step >= s.number ? 1 : 0.5,
                  scale: step === s.number ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-1",
                    step > s.number
                      ? "bg-purple-500 text-white"
                      : step === s.number
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {step > s.number ? <Check className="h-5 w-5" /> : s.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    step >= s.number ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {s.title}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-teal-600"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 overflow-hidden">
          <AnimatePresence mode="wait" custom={step}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-[400px]"
              >
                <div className="flex justify-between items-center pb-4">
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-semibold text-gray-800"
                  >
                    Select a Doctor
                  </motion.h2>
                  {/* Pagination */}
                  {doctors?.length != undefined && doctors?.length > 0 && (
                    <div className="flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="border-teal-200 text-teal-700 hover:bg-teal-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((number) => {
                            // Show first page, last page, current page, and pages around current
                            const shouldShow =
                              number === 1 ||
                              number === totalPages ||
                              Math.abs(number - currentPage) <= 1;

                            // Show ellipsis for gaps
                            if (!shouldShow) {
                              // Only show one ellipsis between gaps
                              if (number === 2 || number === totalPages - 1) {
                                return (
                                  <span
                                    key={number}
                                    className="px-2 text-gray-400"
                                  >
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            }

                            return (
                              <Button
                                key={number}
                                variant={
                                  currentPage === number ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() => paginate(number)}
                                className={
                                  currentPage === number
                                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                                    : "border-teal-200 text-teal-700 hover:bg-teal-50"
                                }
                              >
                                {number}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            paginate(Math.min(totalPages, currentPage + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="border-teal-200 text-teal-700 hover:bg-teal-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </nav>
                    </div>
                  )}
                </div>
                <motion.div variants={itemVariants} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name or specialty..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="space-y-3 max-h-[300px] overflow-y-auto px-3 py-2"
                >
                  {doctors && doctors?.length > 0 ? (
                    doctors?.map((doctor) => (
                      <motion.div
                        key={doctor.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all",
                          selectedDoctor?.id === doctor.id
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-200 hover:border-teal-300"
                        )}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4">
                            <img
                              src={`http://localhost:8080${doctor.profilePictureURL}`}
                              alt={doctor.firstName + " " + doctor.lastName}
                            />
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {doctor.firstName} {doctor.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {doctor.specialization}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-sm font-medium">5</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p
                      variants={itemVariants}
                      className="text-center text-gray-500 py-8"
                    >
                      No doctors found matching your search.
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={2}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-[400px]"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-xl font-semibold mb-4 text-gray-800"
                >
                  Select a Date
                </motion.h2>
                {selectedDoctor && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-6 p-3 bg-teal-50 rounded-lg flex items-center"
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <img
                        src={`http://localhost:8080${selectedDoctor.profilePictureURL}`}
                        alt={
                          selectedDoctor.firstName +
                          " " +
                          selectedDoctor.lastName
                        }
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedDoctor.firstName +
                          " " +
                          selectedDoctor.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedDoctor.specialization}
                      </p>
                    </div>
                  </motion.div>
                )}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center"
                >
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    classNames={{
                      caption: "flex justify-center items-center relative",
                      caption_label: "text-sm font-medium text-center",
                      nav: "flex absolute top-0 inset-x-0 justify-between items-center",
                      nav_button: cn(
                        buttonVariants({ variant: "outline" }),
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                      ),
                      nav_button_previous: "ml-1",
                      nav_button_next: "mr-1",
                    }}
                    disabled={(date) => {
                      // Disable past dates and weekends
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const day = date.getDay();
                      return date < today || day === 0 || day === 6;
                    }}
                  />
                </motion.div>
                {selectedDate && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center text-sm text-teal-600 font-medium"
                  >
                    You selected: {format(selectedDate, "EEEE, MMMM do, yyyy")}
                  </motion.p>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={3}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-[400px]"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-xl font-semibold mb-4 text-gray-800"
                >
                  Select a Time
                </motion.h2>
                {selectedDoctor && selectedDate && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-6 p-3 bg-teal-50 rounded-lg"
                  >
                    <div className="flex items-center mb-2">
                      <Avatar className="h-10 w-10 mr-3">
                        <img
                          src={
                            selectedDoctor.profilePictureURL ||
                            "/placeholder.svg"
                          }
                          alt={
                            selectedDoctor.firstName +
                            " " +
                            selectedDoctor.lastName
                          }
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedDoctor.firstName +
                            " " +
                            selectedDoctor.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedDoctor.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <Calendar className="inline-block h-4 w-4 mr-1" />
                      {format(selectedDate, "EEEE, MMMM do, yyyy")}
                    </div>
                  </motion.div>
                )}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-3 gap-3 sm:grid-cols-4"
                >
                  {timeSlots.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 px-4 rounded-lg text-center text-sm font-medium transition-all cursor-pointer",
                        selectedTime === time
                          ? "bg-teal-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {time}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={4}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-[400px]"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-xl font-semibold mb-4 text-gray-800"
                >
                  Add Notes
                </motion.h2>
                {selectedDoctor && selectedDate && selectedTime && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-6 p-4 bg-teal-50 rounded-lg"
                  >
                    <div className="flex items-center mb-3">
                      <Avatar className="h-12 w-12 mr-4">
                        <img
                          src={`http://localhost:8080${selectedDoctor.profilePictureURL}`}
                          alt={
                            selectedDoctor.firstName +
                            " " +
                            selectedDoctor.lastName
                          }
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedDoctor.firstName +
                            " " +
                            selectedDoctor.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedDoctor.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Calendar className="inline-block h-4 w-4 mr-2" />
                        {format(selectedDate, "EEEE, MMMM do, yyyy")}
                      </div>
                      <div className="flex items-center">
                        <Clock className="inline-block h-4 w-4 mr-2" />
                        {selectedTime}
                      </div>
                      <div className="flex items-center">
                        <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                          Video Call
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}
                <motion.div variants={itemVariants} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Reason for appointment / Notes for the doctor
                  </label>
                  <Textarea
                    placeholder="Please describe your symptoms or reason for the appointment..."
                    className="min-h-[120px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    This information will help the doctor prepare for your
                    appointment.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex items-center justify-center bg-white z-50"
            >
              <div className="text-center p-8 max-w-md">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Appointment Booked!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your appointment has been successfully scheduled. Redirecting
                  to dashboard...
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2 }}
                  className="h-1 bg-green-500 rounded-full w-full origin-left"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between ">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="flex items-center cursor-pointer hover:opacity-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled() || isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </div>
            ) : step === 4 ? (
              <>
                Confirm Booking <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
