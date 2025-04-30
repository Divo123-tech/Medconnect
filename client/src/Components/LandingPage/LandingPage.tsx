import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  //   FileText,
  Lock,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/Components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "../ui/badge";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState<number | null>(null);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-teal-500" />,
      title: "Easy Scheduling",
      description:
        "Book appointments with just a few clicks, 24/7 from anywhere.",
    },
    // {
    //   icon: <MessageSquare className="h-6 w-6 text-teal-500" />,
    //   title: "Secure Messaging",
    //   description:
    //     "Communicate with your healthcare provider through our encrypted platform.",
    // },
    // {
    //   icon: <FileText className="h-6 w-6 text-teal-500" />,
    //   title: "Digital Records",
    //   description: "Access your medical history and prescriptions anytime.",
    // },
    {
      icon: <Users className="h-6 w-6 text-teal-500" />,
      title: "Find Specialists",
      description:
        "Connect with the right healthcare professional for your specific needs.",
    },
    // {
    //   icon: <Clock className="h-6 w-6 text-teal-500" />,
    //   title: "Reminders",
    //   description: "Never miss an appointment with automated notifications.",
    // },
    {
      icon: <Shield className="h-6 w-6 text-teal-500" />,
      title: "HIPAA Compliant",
      description:
        "Your data is protected with enterprise-grade security and encryption.",
    },
  ];

  const testimonials = [
    {
      quote:
        "MedConnect has transformed how I manage my practice. I can focus more on patient care and less on administrative tasks.",
      author: "Dr. Sarah Johnson",
      role: "Cardiologist",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      quote:
        "As someone with a chronic condition, having easy access to my doctors has been life-changing. I feel more in control of my health.",
      author: "Michael Chen",
      role: "Patient",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      quote:
        "The platform is intuitive and makes scheduling appointments so simple. I love being able to message my doctor directly with questions.",
      author: "Emily Rodriguez",
      role: "Patient",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
  ];
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      rating: 5,
      experience: "12 yrs",
      available: "Today",
      image: "/placeholder.svg?height=60&width=60",
      bgColor: "bg-teal-100",
      textColor: "text-teal-600",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      rating: 4.9,
      experience: "8 yrs",
      available: "Tomorrow",
      image: "/placeholder.svg?height=60&width=60",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: 3,
      name: "Dr. Emily Taylor",
      specialty: "Neurology",
      rating: 4.8,
      experience: "15 yrs",
      available: "Today",
      image: "/placeholder.svg?height=60&width=60",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ];
  const faqs = [
    {
      question: "How do I schedule an appointment?",
      answer:
        "Simply create an account, search for a healthcare provider based on specialty, location, or availability, and select an available time slot that works for you. You'll receive an immediate confirmation and reminders as your appointment approaches.",
    },
    {
      question: "Is my medical information secure?",
      answer:
        "Absolutely. We take your privacy seriously. Our platform is fully HIPAA-compliant and uses enterprise-grade encryption to protect your personal and medical information. We never share your data without your explicit consent.",
    },
    {
      question: "Can I use insurance with MedConnect?",
      answer:
        "Yes, MedConnect works with most major insurance providers. During registration, you can enter your insurance information, and we'll verify your coverage before appointments. You'll always see any potential costs upfront before confirming.",
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer:
        "You can cancel or reschedule appointments through your patient dashboard up to 24 hours before your scheduled time without any penalty. For cancellations less than 24 hours in advance, please contact your provider directly.",
    },
    {
      question: "How do virtual appointments work?",
      answer:
        "Virtual appointments take place through our secure video platform. You'll receive a link to join your appointment 15 minutes before the scheduled time. Ensure you have a stable internet connection and a private space for your consultation.",
    },
    {
      question: "I'm a healthcare provider. How do I join MedConnect?",
      answer:
        "We'd love to have you! Click on the 'For Providers' section on our website to start the application process. We'll guide you through setting up your profile, connecting your calendar, and onboarding your practice to our platform.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white mr-2">
                  <Stethoscope size={24} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                  MedConnect
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                FAQ
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-teal-200 text-teal-600 hover:bg-teal-50"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X size={24} />
                ) : (
                  <div className="space-y-1.5 w-6">
                    <span className="block h-0.5 w-full bg-current"></span>
                    <span className="block h-0.5 w-full bg-current"></span>
                    <span className="block h-0.5 w-full bg-current"></span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                to="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="#faq"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-teal-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <Link to="/login" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-teal-200 text-teal-600 hover:bg-teal-50"
                  >
                    Log In
                  </Button>
                </Link>
              </div>
              <div className="mt-3 px-5 pb-2">
                <Link to="/register" className="w-full">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white py-20 sm:py-6">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-center opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center lg:text-left"
              >
                <motion.h1
                  variants={fadeIn}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6"
                >
                  Healthcare,{" "}
                  <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                    simplified
                  </span>
                </motion.h1>
                <motion.p
                  variants={fadeIn}
                  className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
                >
                  Connect with trusted healthcare professionals, schedule
                  appointments, and manage your health journey—all in one secure
                  platform.
                </motion.p>
                <motion.div
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="#how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-teal-200 text-teal-600 hover:bg-teal-50"
                    >
                      How It Works
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  variants={fadeIn}
                  className="mt-8 flex items-center justify-center lg:justify-start"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-teal-100"
                      >
                        <img
                          src={`/placeholder.svg?height=32&width=32&text=${i}`}
                          alt="User"
                          width={32}
                          height={32}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="ml-3 text-sm text-gray-600">
                    <span className="font-medium text-teal-600">4,000+</span>{" "}
                    patients trust us
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative mx-auto w-full max-w-md">
                  <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
                  <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

                  {/* Miniature Browse Doctors Page */}
                  <div className="relative">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                      {/* Browser-like header */}
                      <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-teal-500 to-teal-600">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-white/20"></div>
                            <div className="w-20 h-2 rounded-full bg-white/20"></div>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          Find Your Doctor
                        </h3>

                        {/* Search bar */}
                        <div className="relative mb-3">
                          <input
                            type="text"
                            placeholder="Search doctors, specialties..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-9 pr-4 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                          />
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
                        </div>
                      </div>

                      {/* Doctor cards */}
                      <div className="p-4">
                        <div className="space-y-3">
                          {doctors.map((doctor) => (
                            <motion.div
                              key={doctor.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: doctor.id * 0.1 }}
                              whileHover={{
                                scale: 1.02,
                                boxShadow:
                                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                              }}
                              className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm cursor-pointer relative"
                              onMouseEnter={() => setActiveDoctor(doctor.id)}
                              onMouseLeave={() => setActiveDoctor(null)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <div
                                    className={`w-12 h-12 rounded-full ${doctor.bgColor} flex items-center justify-center mr-3 overflow-hidden`}
                                  >
                                    <img
                                      src={doctor.image || "/placeholder.svg"}
                                      alt={doctor.name}
                                      width={48}
                                      height={48}
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800 text-sm">
                                      {doctor.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {doctor.specialty}
                                    </p>
                                    <div className="flex items-center mt-1">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className="h-3 w-3 text-yellow-400 fill-yellow-400"
                                          />
                                        ))}
                                      </div>
                                      <span className="text-xs text-gray-500 ml-1">
                                        {doctor.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  className={`${
                                    doctor.available === "Today"
                                      ? "bg-teal-100 text-teal-700"
                                      : "bg-blue-100 text-blue-700"
                                  } text-xs`}
                                >
                                  {doctor.available}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between mt-2 text-xs">
                                <div className="flex items-center text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{doctor.experience} exp</span>
                                </div>

                                {/* Book button - animated on hover */}
                                <motion.button
                                  initial={{ opacity: 0.8 }}
                                  animate={{
                                    opacity:
                                      activeDoctor === doctor.id ? 1 : 0.8,
                                    scale:
                                      activeDoctor === doctor.id ? 1.05 : 1,
                                  }}
                                  className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-xs font-medium"
                                >
                                  Book Now
                                </motion.button>
                              </div>

                              {/* Animated pulse when hovered */}
                              {activeDoctor === doctor.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute -right-1 -top-1 w-3 h-3 bg-teal-400 rounded-full"
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Number.POSITIVE_INFINITY,
                                    }}
                                    className="absolute inset-0 bg-teal-400 rounded-full opacity-70"
                                  />
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {/* View more button */}
                        <div className="mt-3 text-center">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-xs text-teal-600 font-medium hover:text-teal-700"
                          >
                            View more doctors →
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile App Preview - Floating on the side */}

                    {/* Notification Bubbles */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="absolute -left-12 bottom-1/4 bg-white rounded-lg shadow-lg p-4 border border-gray-100 hidden md:block"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Phone className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Incoming Call
                          </p>
                          <p className="text-xs text-gray-500">
                            Dr. Taylor - Tap to join
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="absolute -right-12 bottom-10 bg-white rounded-lg shadow-lg p-4 border border-gray-100 hidden md:block"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Appointment Confirmed
                          </p>
                          <p className="text-xs text-gray-500">
                            Dr. Johnson - 2:30 PM
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-lg font-semibold text-gray-600">
                Trusted by leading healthcare providers
              </h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                >
                  <img
                    src={`/placeholder.svg?height=40&width=120&text=Partner${i}`}
                    alt={`Partner ${i}`}
                    width={120}
                    height={40}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Patients & Doctors Tabs */}
        <section className="py-20 bg-white" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                How MedConnect Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Whether you're a patient seeking care or a healthcare provider,
                MedConnect streamlines the entire process.
              </motion.p>
            </div>

            <Tabs defaultValue="patients" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="patients" className="text-base">
                    <User className="mr-2 h-4 w-4" />
                    For Patients
                  </TabsTrigger>
                  <TabsTrigger value="doctors" className="text-base">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    For Doctors
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="patients">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <User className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      1. Create Your Profile
                    </h3>
                    <p className="text-gray-600">
                      Sign up and complete your health profile with your medical
                      history, insurance information, and preferences.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      2. Find Your Doctor
                    </h3>
                    <p className="text-gray-600">
                      Search for healthcare providers by specialty, location,
                      availability, or insurance acceptance.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      3. Book Appointments
                    </h3>
                    <p className="text-gray-600">
                      Schedule in-person or virtual appointments at times that
                      work for you, with instant confirmation.
                    </p>
                  </motion.div>
                </div>

                <div className="mt-12 text-center">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Sign Up as a Patient
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="doctors">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      1. Join Our Network
                    </h3>
                    <p className="text-gray-600">
                      Complete your professional profile with your credentials,
                      specialties, and practice information.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      2. Set Your Availability
                    </h3>
                    <p className="text-gray-600">
                      Define your working hours and appointment slots, sync with
                      your existing calendar systems.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      3. Manage Your Patients
                    </h3>
                    <p className="text-gray-600">
                      Access patient records, communicate securely, and
                      streamline your practice with our comprehensive tools.
                    </p>
                  </motion.div>
                </div>

                <div className="mt-12 text-center">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Join as a Healthcare Provider
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Features Designed for Better Healthcare
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Our platform combines powerful tools with an intuitive interface
                to make healthcare management simple.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white" id="testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                What Our Users Say
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Thousands of patients and healthcare providers trust MedConnect
                every day.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="#"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Read more testimonials →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50" id="faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-600"
              >
                Find answers to common questions about MedConnect.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 bg-white hover:bg-gray-50 text-left font-medium text-gray-900">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 bg-white text-gray-600 border-t border-t-gray-200">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold mb-6"
            >
              Ready to transform your healthcare experience?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto"
            >
              Join thousands of patients and healthcare providers who are
              already using MedConnect to simplify their healthcare journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-teal-50"
                >
                  Get Started for Free
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-teal-700"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white mr-2">
                  <Stethoscope size={24} />
                </div>
                <span className="text-xl font-bold text-white">MedConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting patients and healthcare providers for a better
                healthcare experience.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-teal-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-teal-400">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MedConnect. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <div className="flex items-center mr-4">
                <Lock className="h-4 w-4 text-teal-400 mr-1" />
                <span className="text-gray-400 text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-teal-400 mr-1" />
                <span className="text-gray-400 text-sm">
                  256-bit Encryption
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Search({ className, ...props }: React.ComponentProps<typeof User>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-search", className)}
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
