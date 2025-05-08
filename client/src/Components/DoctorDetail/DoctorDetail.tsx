import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
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
import { Badge } from "@/Components/ui/badge";
import { getSingleDoctor } from "@/services/doctorService";
import ProfileBadge from "../ProfileBadge";
import { useAuthStore } from "@/store/authStore";

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
  const { user, setUser, setToken } = useAuthStore();
  // Calculate years of experience based on startedPracticingAt
  const calculateYearsExperience = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  };
  const logout = () => {
    setUser(null);
    setToken(null);
  };
  useEffect(() => {
    const fetchDoctor = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getSingleDoctor(params.id);
        setDoctor(result);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor profile. Please try again.");
      }
    };

    if (params.id) {
      fetchDoctor();
    }
  }, [params, params.id]);

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
        <header className="py-4 lg:px-8 bg-white shadow-sm relative overflow-hidden">
          <div className="mx-auto relative w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-6">
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
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                {user == null ? (
                  <>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        className="border-teal-200 text-teal-600 hover:bg-teal-50 cursor-pointer"
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
                        Sign Up
                      </Button>
                    </Link>{" "}
                  </>
                ) : (
                  <div className="flex gap-4">
                    <ProfileBadge />
                    <Button
                      variant="outline"
                      className="border-red-400 text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={logout}
                    >
                      Log Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Cool medical loading animation overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6">
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
                  <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-12 w-12 text-teal-600" />
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
              <div className="relative h-16 w-80 mb-6">
                <svg viewBox="0 0 400 100" className="w-full h-full">
                  <motion.path
                    d="M0,50 Q50,50 70,50 T100,50 120,20 140,90 160,50 180,50 200,50 220,50 240,20 260,90 280,50 300,50 320,50 340,50 360,50 380,50 400,50"
                    fill="transparent"
                    stroke="#0d9488"
                    strokeWidth="3"
                    initial={{ pathLength: 0, pathOffset: 0 }}
                    animate={{ pathLength: 1, pathOffset: 0 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    onAnimationComplete={() => setIsLoading(false)}
                  />
                </svg>
              </div>

              {/* Animated medical icons */}
              <div className="flex justify-center space-x-8 mb-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="bg-blue-100 p-3 rounded-full"
                >
                  <Activity className="h-6 w-6 text-blue-600" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, -5, 0, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 0.5,
                  }}
                  className="bg-teal-100 p-3 rounded-full"
                >
                  <User className="h-6 w-6 text-teal-600" />
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                  className="bg-red-100 p-3 rounded-full"
                >
                  <Award className="h-6 w-6 text-red-600" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-teal-700 font-medium text-xl text-center"
              >
                Loading Doctor Profile
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  ...
                </motion.span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-gray-500 mt-2 text-center max-w-sm"
              >
                We're gathering all the information about this healthcare
                professional for you
              </motion.p>
            </div>
          </div>

          {/* Blurred background layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 filter blur-[4px] opacity-30">
            {/* Left column - Doctor info */}
            <div className="lg:col-span-1">
              <Card className="border-teal-100 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-48 h-48 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-8 w-3/4 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-6 w-1/2 bg-gray-200 mb-4 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 mb-4 rounded"></div>
                  </div>

                  <div className="space-y-4 border-t border-teal-100 pt-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 w-1/3 bg-gray-200 mb-2 rounded"></div>
                          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - About and Reviews */}
            <div className="lg:col-span-2">
              <Card className="border-teal-100 shadow-md mb-6">
                <CardHeader>
                  <div className="h-8 w-1/3 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-teal-100 shadow-md">
                <CardHeader>
                  <div className="h-8 w-1/3 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-24 w-full bg-gray-200 rounded"></div>
                    <div className="h-24 w-full bg-gray-200 rounded"></div>
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
      <header className="py-4 lg:px-8 bg-white shadow-sm relative overflow-hidden">
        <div className="mx-auto relative w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
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
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              {user == null ? (
                <>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="border-teal-200 text-teal-600 hover:bg-teal-50 cursor-pointer"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>{" "}
                </>
              ) : (
                <div className="flex gap-4">
                  <ProfileBadge />
                  <Button
                    variant="outline"
                    className="border-red-400 text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={logout}
                  >
                    Log Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Link
          to="/doctors"
          className="flex items-center w-fit text-teal-600 mr-4 my-4 hover:border-b"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span className="text-sm">Back to Doctors</span>
        </Link>
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

                  <Link to="/book-appointment" className="mt-6 w-full">
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Appointment
                    </Button>
                  </Link>
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
