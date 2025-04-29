import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  Stethoscope,
  ThumbsUp,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";

import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Badge } from "@/Components/ui/badge";

// Using the exact Doctor type as provided
export type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  specialization: string;
  startedPracticingAt: string; // ISO date string like "2020-04-25"
  education: string;
  bio: string;
  profilePictureURL: string;
};

export default function DoctorProfilePage() {
  const params = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate years of experience based on startedPracticingAt
  const calculateYearsExperience = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate an API call with a timeout
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data for the doctor
        const mockDoctor: Doctor = {
          id: Number(params.id),
          firstName: "Sarah",
          lastName: "Johnson",
          role: "DOCTOR",
          specialization: "Cardiology",
          startedPracticingAt: "2010-06-15",
          education:
            "MD, Harvard Medical School\nResidency, Massachusetts General Hospital\nFellowship in Cardiology, Cleveland Clinic",
          bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology, heart health management, and interventional procedures. Dr. Johnson takes a patient-centered approach to care, focusing on lifestyle modifications alongside medical interventions to achieve optimal heart health outcomes. She has published numerous research papers on cardiovascular health and regularly speaks at medical conferences.",
          profilePictureURL: "/placeholder.svg?height=400&width=400",
        };

        setDoctor(mockDoctor);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchDoctor();
    }
  }, [params.id]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
        <header className="bg-gradient-to-r from-teal-500 to-teal-600 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <Link
              to="/doctors"
              className="flex items-center text-white hover:text-teal-100 mr-4"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span className="text-sm">Back to Doctors</span>
            </Link>
            <Skeleton className="h-8 w-48 bg-white/20" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="border-teal-100 shadow-md">
                <CardContent className="p-6 flex flex-col items-center">
                  <Skeleton className="h-48 w-48 rounded-full mb-6" />
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border-teal-100 shadow-md mb-6">
                <CardHeader>
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>

              <Card className="border-teal-100 shadow-md">
                <CardHeader>
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white flex items-center justify-center">
        <Card className="border-red-200 shadow-md max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              We encountered a problem loading this doctor's profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-gray-600 mb-4">{error || "Doctor not found"}</p>
            <Button
              onClick={() => navigate("/doctors")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Return to Doctors List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate years of experience
  const yearsExperience = calculateYearsExperience(doctor.startedPracticingAt);

  // Format education for display (split by newlines)
  const educationItems = doctor.education.split("\n");

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link
            to="/doctors"
            className="flex items-center text-white hover:text-teal-100 mr-4"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span className="text-sm">Back to Doctors</span>
          </Link>
          <h1 className="text-xl font-semibold text-white">Doctor Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 bg-white"
          >
            <Card className="border-teal-100 shadow-md sticky top-8">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 border-4 border-teal-300 shadow-md mb-4">
                    <img
                      src={doctor.profilePictureURL || "/placeholder.svg"}
                      alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h2>
                  <p className="text-teal-600 font-medium text-lg">
                    {doctor.specialization}
                  </p>

                  <div className="mt-6 w-full">
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Appointment
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border-t border-teal-100 pt-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Experience</p>
                      <p className="text-gray-600">{yearsExperience} years</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Stethoscope className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">
                        Specialization
                      </p>
                      <p className="text-gray-600">{doctor.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">
                        Practicing Since
                      </p>
                      <p className="text-gray-600">
                        {new Date(doctor.startedPracticingAt).getFullYear()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-teal-500 mr-3 mt-1" />
                    <div>
                      <p className="text-gray-700 font-medium">Education</p>
                      <ul className="text-gray-600 space-y-2 mt-1">
                        {educationItems.map((item, index) => (
                          <li key={index} className="pl-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Contact</p>
                      <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Location</p>
                      <p className="text-gray-600">Medical Center, Suite 302</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            {/* About Section */}
            <Card className="border-teal-100 shadow-md mb-6 bg-white">
              <CardHeader>
                <CardTitle className="text-teal-800 flex items-center">
                  <User className="mr-2 h-5 w-5 text-teal-600" />
                  About Dr. {doctor.firstName} {doctor.lastName}
                </CardTitle>
                <CardDescription>
                  Professional background and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge
                      variant="outline"
                      className="bg-teal-50 text-teal-700 border-teal-200"
                    >
                      {yearsExperience}+ years experience
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Board Certified
                    </Badge>
                    {doctor.specialization === "Cardiology" && (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        Heart Specialist
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      Research Published
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-teal-100 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-teal-800 flex items-center">
                  <ThumbsUp className="mr-2 h-5 w-5 text-teal-600" />
                  Patient Reviews
                </CardTitle>
                <CardDescription>What patients are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                      5.0
                    </span>
                    <span className="text-gray-500 ml-2">(48 reviews)</span>
                  </div>

                  {/* Sample reviews */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          1 month ago
                        </span>
                      </div>
                      <p className="text-gray-700">
                        "Dr. Johnson is an exceptional cardiologist. She took
                        the time to explain my condition thoroughly and created
                        a treatment plan that worked perfectly for me. Highly
                        recommend!"
                      </p>
                      <p className="text-gray-600 text-sm mt-2">- Michael R.</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          3 months ago
                        </span>
                      </div>
                      <p className="text-gray-700">
                        "Very knowledgeable and caring doctor. She made me feel
                        comfortable and addressed all my concerns. The office
                        staff is also very friendly and efficient."
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        - Jennifer T.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                  >
                    View All Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
