import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  // Filter,
  X,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import DoctorCard from "./DoctorCard";
import { getDoctors } from "@/services/doctorService";

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
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  // Mock data for doctors using the provided type

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
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[] | null>(null);
  const [sortBy, setSortBy] = useState<string>("firstName");
  // const [showFilters, setShowFilters] = useState(false);

  const doctorsPerPage = 10;

  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchDoctorsData = async () => {
      setIsLoading(true);
      setDoctors(null);
      try {
        const data = await getDoctors({
          page: currentPage - 1,
          size: doctorsPerPage,
          name: searchTerm.trim(),
          specialization:
            selectedSpecialization === "All Specializations"
              ? ""
              : selectedSpecialization,
          sortBy, // You can make this dynamic if needed
        });

        setDoctors(data.content);
        setTotalPages(data.totalPages);
        console.log(data.content);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctorsData();
  }, [currentPage, searchTerm, selectedSpecialization, sortBy]);

  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors?.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredDoctors(doctors);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [doctors]);

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
              {/* <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button> */}
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
                <SelectTrigger className="border-teal-200 focus:ring-teal-300 w-full">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {specializations.map((specialization) => (
                    <SelectItem
                      key={specialization}
                      value={specialization}
                      className={`${
                        specialization == selectedSpecialization &&
                        "bg-teal-100"
                      } hover:bg-teal-100 cursor-pointer`}
                    >
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional filters - shown when filter button is clicked */}
          {/* <AnimatePresence>
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
                      <SelectTrigger className="border-teal-200 focus:ring-teal-300 w-3/4">
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
                      <SelectTrigger className="border-teal-200 focus:ring-teal-300 w-3/4">
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
          </AnimatePresence> */}
        </div>

        {/* Results count and sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="text-gray-600 mb-2 sm:mb-0">
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <p>
                Showing{" "}
                <span className="font-medium">{filteredDoctors?.length}</span>{" "}
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
            <Select
              defaultValue="recommended"
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px] border-teal-200 focus:ring-teal-300 bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="firstName" className="hover:bg-teal-100">
                  First Name
                </SelectItem>
                <SelectItem value="lastName" className="hover:bg-teal-100">
                  Last Name
                </SelectItem>
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
        ) : filteredDoctors?.length === 0 ? (
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
              {currentDoctors?.map((doctor) => {
                return <DoctorCard doctor={doctor} key={doctor.id} />;
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!isLoading &&
          filteredDoctors?.length != undefined &&
          filteredDoctors?.length > 0 && (
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
                    }
                  )}
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
    </div>
  );
}
