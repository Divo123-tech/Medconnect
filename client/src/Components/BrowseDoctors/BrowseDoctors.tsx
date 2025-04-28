import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Filter,
  X,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

// Define the Doctor type as provided
type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  specialization: string;
  startedPracticingAt: string; // Using string for date handling in form
  education: string;
  bio: string;
  profilePictureURL: string;
};

export default function DoctorsPage() {
  // Mock data for doctors using the provided type
  const allDoctors: Doctor[] = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      role: "DOCTOR",
      specialization: "Cardiology",
      startedPracticingAt: "2010-06-15",
      education:
        "MD, Harvard Medical School\nResidency, Massachusetts General Hospital",
      bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and heart health management.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Chen",
      role: "DOCTOR",
      specialization: "Dermatology",
      startedPracticingAt: "2014-03-22",
      education: "MD, Stanford University\nResidency, UCSF Medical Center",
      bio: "Dr. Michael Chen specializes in medical and cosmetic dermatology, with particular expertise in treating skin conditions and performing minimally invasive cosmetic procedures.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 3,
      firstName: "Jessica",
      lastName: "Williams",
      role: "DOCTOR",
      specialization: "Pediatrics",
      startedPracticingAt: "2007-09-10",
      education:
        "MD, Johns Hopkins University\nResidency, Children's Hospital of Philadelphia",
      bio: "Dr. Jessica Williams is a compassionate pediatrician dedicated to providing comprehensive care for children of all ages, from newborns to adolescents.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Rodriguez",
      role: "DOCTOR",
      specialization: "Orthopedics",
      startedPracticingAt: "2012-05-18",
      education:
        "MD, University of Chicago\nFellowship, Hospital for Special Surgery",
      bio: "Dr. David Rodriguez specializes in sports medicine and joint replacement surgery with a focus on minimally invasive techniques to promote faster recovery times.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 5,
      firstName: "Emily",
      lastName: "Taylor",
      role: "DOCTOR",
      specialization: "Neurology",
      startedPracticingAt: "2008-11-30",
      education: "MD, University of Washington\nResidency, Mayo Clinic",
      bio: "Dr. Emily Taylor is a neurologist specializing in the diagnosis and treatment of complex neurological disorders, including stroke, epilepsy, and neurodegenerative diseases.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 6,
      firstName: "James",
      lastName: "Wilson",
      role: "DOCTOR",
      specialization: "Psychiatry",
      startedPracticingAt: "2011-08-05",
      education: "MD, Baylor College of Medicine\nResidency, McLean Hospital",
      bio: "Dr. James Wilson is dedicated to providing compassionate mental health care with a focus on anxiety, depression, and mood disorders using evidence-based approaches.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 7,
      firstName: "Sophia",
      lastName: "Garcia",
      role: "DOCTOR",
      specialization: "Obstetrics and Gynecology",
      startedPracticingAt: "2013-02-14",
      education:
        "MD, University of Miami\nResidency, Brigham and Women's Hospital",
      bio: "Dr. Sophia Garcia provides comprehensive women's health care with a focus on prenatal care, reproductive health, and minimally invasive gynecological procedures.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 8,
      firstName: "Robert",
      lastName: "Kim",
      role: "DOCTOR",
      specialization: "Ophthalmology",
      startedPracticingAt: "2009-07-22",
      education: "MD, UCLA School of Medicine\nResidency, Wills Eye Hospital",
      bio: "Dr. Robert Kim specializes in cataract surgery and treatment of retinal diseases with the latest technologies and approaches to preserve and improve vision.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 9,
      firstName: "Olivia",
      lastName: "Martinez",
      role: "DOCTOR",
      specialization: "Endocrinology",
      startedPracticingAt: "2015-05-03",
      education: "MD, University of Colorado\nFellowship, Cleveland Clinic",
      bio: "Dr. Olivia Martinez specializes in diabetes management and thyroid disorders with a holistic approach to treatment that emphasizes lifestyle modifications alongside medical interventions.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 10,
      firstName: "William",
      lastName: "Thompson",
      role: "DOCTOR",
      specialization: "Gastroenterology",
      startedPracticingAt: "2006-11-12",
      education:
        "MD, University of Pennsylvania\nFellowship, Massachusetts General Hospital",
      bio: "Dr. William Thompson is an experienced gastroenterologist specializing in digestive disorders, inflammatory bowel disease, and colorectal cancer screening and prevention.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 11,
      firstName: "Ava",
      lastName: "Brown",
      role: "DOCTOR",
      specialization: "Dermatology",
      startedPracticingAt: "2016-09-28",
      education:
        "MD, Oregon Health & Science University\nResidency, NYU Langone",
      bio: "Dr. Ava Brown provides comprehensive dermatological care with expertise in acne treatment, skin cancer screening, and cosmetic procedures to help patients feel confident in their skin.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 12,
      firstName: "Daniel",
      lastName: "Lee",
      role: "DOCTOR",
      specialization: "Cardiology",
      startedPracticingAt: "2004-03-17",
      education: "MD, Baylor College of Medicine\nFellowship, Cleveland Clinic",
      bio: "Dr. Daniel Lee is a highly experienced cardiologist specializing in interventional procedures and heart disease prevention with a patient-centered approach to care.",
      profilePictureURL: "/placeholder.svg?height=400&width=400",
    },
  ];

  const specializations = [
    "All Specializations",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    "All Specializations"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const doctorsPerPage = 6;
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  // Calculate years of experience based on startedPracticingAt
  const calculateYearsExperience = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  };

  // Filter doctors based on search term and specialization
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = allDoctors;

      // Filter by name
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (doctor) =>
            doctor.firstName.toLowerCase().includes(term) ||
            doctor.lastName.toLowerCase().includes(term)
        );
      }

      // Filter by specialization
      if (selectedSpecialization !== "All Specializations") {
        results = results.filter(
          (doctor) => doctor.specialization === selectedSpecialization
        );
      }

      setFilteredDoctors(results);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [searchTerm, selectedSpecialization]);

  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredDoctors(allDoctors);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [allDoctors]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Stethoscope className="mr-2 h-6 w-6" />
                Find Your Doctor
              </h1>
              <p className="text-teal-100 mt-1">
                Browse our network of experienced healthcare professionals
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  className="bg-white text-teal-600 border-white hover:bg-teal-50"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-teal-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search doctors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-teal-200 focus:border-teal-400 focus:ring-teal-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="w-full md:w-64">
              <Select
                value={selectedSpecialization}
                onValueChange={setSelectedSpecialization}
              >
                <SelectTrigger className="border-teal-200 focus:ring-teal-300">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional filters - shown when filter button is clicked */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-teal-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <Select defaultValue="any">
                      <SelectTrigger className="border-teal-200 focus:ring-teal-300">
                        <SelectValue placeholder="Any experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any experience</SelectItem>
                        <SelectItem value="15">15+ years</SelectItem>
                        <SelectItem value="10">10+ years</SelectItem>
                        <SelectItem value="5">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education
                    </label>
                    <Select defaultValue="any">
                      <SelectTrigger className="border-teal-200 focus:ring-teal-300">
                        <SelectValue placeholder="Any education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any education</SelectItem>
                        <SelectItem value="harvard">
                          Harvard Medical School
                        </SelectItem>
                        <SelectItem value="stanford">
                          Stanford University
                        </SelectItem>
                        <SelectItem value="johns_hopkins">
                          Johns Hopkins University
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count and sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="text-gray-600 mb-2 sm:mb-0">
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <p>
                Showing{" "}
                <span className="font-medium">{filteredDoctors.length}</span>{" "}
                doctors
                {searchTerm && (
                  <span>
                    {" "}
                    for <span className="font-medium">"{searchTerm}"</span>
                  </span>
                )}
                {selectedSpecialization !== "All Specializations" && (
                  <span>
                    {" "}
                    in{" "}
                    <span className="font-medium">
                      {selectedSpecialization}
                    </span>
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[180px] border-teal-200 focus:ring-teal-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctor Cards */}
        {isLoading ? (
          <div className="relative">
            {/* Loading overlay with medical animation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 rounded-xl backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  {/* Animated stethoscope */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [0.8, 1.1, 0.9, 1],
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-10 w-10 text-teal-600" />
                    </div>
                  </motion.div>

                  {/* Animated pulse rings */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-full border-4 border-teal-300"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeOut",
                      delay: 0.5,
                    }}
                    className="absolute inset-0 rounded-full border-4 border-teal-200"
                  />
                </div>

                {/* Heartbeat line */}
                <div className="relative h-12 w-64 mb-4">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    <motion.path
                      d="M0,50 Q50,50 70,50 T100,50 120,20 140,90 160,50 180,50 200,50 220,50 240,20 260,90 280,50 300,50 320,50 340,50 360,50 380,50 400,50"
                      fill="transparent"
                      stroke="#0d9488"
                      strokeWidth="3"
                      initial={{ pathLength: 0, pathOffset: 0 }}
                      animate={{ pathLength: 1, pathOffset: 0 }}
                      transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 0.2,
                      }}
                    />
                  </svg>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-teal-700 font-medium text-lg"
                >
                  Finding the best doctors for you...
                </motion.div>
              </div>
            </div>

            {/* Blurred doctor card skeletons in the background */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 filter blur-[2px]">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden border-teal-100">
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-100 to-blue-100" />
                      <div className="ml-4 flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Skeleton className="h-10 w-28" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto border border-teal-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any doctors matching your search criteria.
                Please try adjusting your filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("All Specializations");
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Clear all filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {currentDoctors.map((doctor) => {
                const yearsExperience = calculateYearsExperience(
                  doctor.startedPracticingAt
                );

                return (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card className="overflow-hidden border-teal-100 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                      <div className="p-6 flex-1">
                        <div className="flex items-start">
                          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 border-2 border-teal-200">
                            <img
                              src={`http://localhost:8080${doctor.profilePictureURL}`}
                              alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <p className="text-teal-600 font-medium">
                              {doctor.specialization}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                <Award className="h-4 w-4 text-teal-500" />
                                <span className="ml-1 text-gray-700 text-sm">
                                  {yearsExperience} years experience
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-start mb-2">
                            <BookOpen className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="ml-2 text-gray-600 text-sm line-clamp-1">
                              {doctor.education.split("\n")[0]}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="ml-2 text-gray-600 text-sm">
                              Practicing since{" "}
                              {new Date(
                                doctor.startedPracticingAt
                              ).getFullYear()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 space-x-2">
                          <Badge
                            variant="outline"
                            className="bg-teal-50 text-teal-700 border-teal-200"
                          >
                            {yearsExperience}+ years exp
                          </Badge>
                          {yearsExperience >= 10 && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Senior Specialist
                            </Badge>
                          )}
                          {doctor.specialization === "Cardiology" && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              Heart Specialist
                            </Badge>
                          )}
                        </div>

                        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                          {doctor.bio}
                        </p>
                      </div>

                      <div className="px-6 pb-6 pt-2 mt-auto flex justify-between items-center">
                        <Button
                          variant="outline"
                          className="border-teal-200 text-teal-700 hover:bg-teal-50"
                        >
                          View Profile
                        </Button>
                        <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
                          Book Appointment
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredDoctors.length > 0 && (
          <div className="mt-8 flex justify-center">
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => {
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
                          <span key={number} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
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
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-teal-200 text-teal-700 hover:bg-teal-50 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
