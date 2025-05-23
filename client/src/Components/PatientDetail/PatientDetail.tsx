import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Activity,
  Ruler,
  Weight,
  Droplet,
  Lock,
  ClipboardList,
  Heart,
  FileUp,
  FilePlus,
  CalendarDays,
  VenusAndMars,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { getPatient } from "@/services/patientService";
import { useAuthStore } from "@/store/authStore";
import { BloodType, MedicalDocument, Patient } from "@/utils/types";
import FileUpload, { FileWithPreview } from "../FileUpload/FileUpload";
import {
  deleteMedicalDocument,
  uploadMedicalDocument,
} from "@/services/fileService";
import {
  bloodTypesMap,
  calculateBMI,
  getBMICategory,
} from "@/utils/converters";

export default function PatientDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDoctor, setIsDoctor] = useState(false); // In a real app, this would be determined by authentication
  // Create example medical documents
  const [medicalDocuments, setMedicalDocuments] = useState<MedicalDocument[]>(
    patient?.medicalDocuments || []
  );
  const { token, user } = useAuthStore();
  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const patient = await getPatient(token, params.id);
        setPatient(patient);
        setMedicalDocuments(patient.medicalDocuments);
        // Mock data for the patient
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError("Failed to load patient profile. Please try again.");
      }
    };

    if (params.id) {
      fetchPatient();
    }
  }, [params.id, token]);

  useEffect(() => {
    setIsDoctor(user?.role == "DOCTOR");
  }, [user?.role]);

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
  const handleFilesAdded = async (newFiles: FileWithPreview[]) => {
    if (!newFiles.length || !patient?.id) return;

    try {
      const formData = new FormData();
      formData.append("file", newFiles[0].file);
      formData.append("patientId", String(patient.id));

      const uploadedDocument = await uploadMedicalDocument(token, formData);

      // ✅ Properly update state after upload
      setMedicalDocuments((prevFiles) => [...prevFiles, uploadedDocument]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileRemove = async (fileId: string) => {
    try {
      await deleteMedicalDocument(token, fileId);
    } catch (err) {
      console.log(err);
    }
    setMedicalDocuments((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (file) => String(file.id) !== fileId
      );
      return updatedFiles;
    });
  };

  // Access control - only doctors should see this page
  if (!isDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white flex items-center justify-center">
        <Card className="border-red-200 shadow-md max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              This page is only accessible to medical professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-gray-600 mb-4">
              You don't have permission to view patient records. If you believe
              this is an error, please contact the system administrator.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading && isDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
        <header className="bg-gradient-to-r from-teal-500 to-teal-600 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <h1 className="text-xl font-semibold text-white">
              Loading Patient Profile...
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Cool medical loading animation overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl flex flex-col items-center">
              <div className="relative w-32 h-32 ">
                {/* Animated heart */}
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
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="h-12 w-12 text-red-500" />
                  </div>
                </motion.div>

                {/* Animated pulse rings */}
                {/* <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-full border-4 border-red-300"
                /> */}
                {/* <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                  className="absolute inset-0 rounded-full border-4 border-red-200"
                /> */}
              </div>

              {/* Heartbeat line */}
              <div className="relative h-16 w-80 mb-6">
                <svg viewBox="0 0 400 100" className="w-full h-full">
                  <motion.path
                    d="M0,50 Q50,50 70,50 T100,50 120,20 140,90 160,50 180,50 200,50 220,50 240,20 260,90 280,50 300,50 320,50 340,50 360,50 380,50 400,50"
                    fill="transparent"
                    stroke="#ef4444"
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
                    duration: 3,
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
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 0.5,
                  }}
                  className="bg-teal-100 p-3 rounded-full"
                >
                  <ClipboardList className="h-6 w-6 text-teal-600" />
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
                  className="bg-purple-100 p-3 rounded-full"
                >
                  <Droplet className="h-6 w-6 text-purple-600" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-teal-700 font-medium text-xl text-center"
              >
                Loading Patient Records
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
                transition={{ duration: 0.5, delay: 1 }}
                className="text-gray-500 mt-2 text-center max-w-sm"
              >
                We're retrieving this patient's medical information for your
                review
              </motion.p>
            </div>
          </div>

          {/* Blurred background layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 filter blur-[4px] opacity-30">
            {/* Left column - Patient info */}
            <div className="lg:col-span-1">
              <Card className="border-teal-100 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-48 h-48 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-8 w-3/4 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-6 w-1/2 bg-gray-200 mb-4 rounded"></div>
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

            {/* Right column - Medical info and conditions */}
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
  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white flex items-center justify-center">
        <Card className="border-red-200 shadow-md max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              We encountered a problem loading this patient's profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-gray-600 mb-4">{error || "Patient not found"}</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Return to Patients List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate BMI for the patient
  const bmi = Number(calculateBMI(patient.height, patient.weight));
  const bmiInfo = getBMICategory(bmi);

  // Format conditions for display (split by newlines)
  const conditionItems = patient?.conditions?.split(",");

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-8 items-center">
          <h1 className="text-xl font-semibold text-white">Patient Profile</h1>
          <Badge className="ml-auto bg-red-500  text-white py-1 px-1">
            Doctor View Only
          </Badge>
          <Link to="/dashboard">
            <Button
              variant="outline"
              className="bg-white text-teal-600 border-white hover:bg-teal-100 cursor-pointer"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left column - Patient basic info */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="border-teal-100 shadow-md sticky top-8 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 border-4 border-teal-300 shadow-md mb-4">
                    <img
                      src={`http://localhost:8080${patient.profilePictureURL}`}
                      alt={`${patient.firstName} ${patient.lastName}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {patient.firstName} {patient.lastName}
                  </h2>
                  <p className="text-teal-600 font-medium">
                    Patient ID: #{patient.id}
                  </p>
                  <p className="text-gray-500">Role: {patient.role}</p>
                </div>

                <div className="space-y-4 border-t border-teal-100 pt-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Full Name</p>
                      <p className="text-gray-600">
                        {patient.firstName} {patient.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Email</p>
                      <p className="text-gray-600">{patient.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Phone</p>
                      <p className="text-gray-600">{patient.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Date of Birth</p>
                      <p className="text-gray-600">{patient.dateOfBirth}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <VenusAndMars className="h-5 w-5 text-teal-500 mr-3" />
                    <div>
                      <p className="text-gray-700 font-medium">Sex</p>
                      <p className="text-gray-600">{patient.sex}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column - Medical info and conditions */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Tabs defaultValue="medical" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-teal-100 p-1">
                <TabsTrigger
                  value="medical"
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-md text-teal-700"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Medical Information
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-md text-teal-700"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Medical Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medical" className="mt-4">
                {/* Medical Information Card */}
                <Card className="border-teal-100 shadow-md mb-6 bg-white">
                  <CardHeader>
                    <CardTitle className="text-teal-800 flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-teal-600" />
                      Medical Information
                    </CardTitle>
                    <CardDescription>
                      Patient's vital statistics and measurements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg border border-teal-100 shadow-md">
                        <h3 className="text-lg font-medium text-teal-800 mb-4">
                          Body Measurements
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Height:</span>
                            <div className="flex items-center">
                              <Ruler className="h-4 w-4 text-teal-500 mr-1" />
                              <span className="font-medium">
                                {patient.height} cm
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Weight:</span>
                            <div className="flex items-center">
                              <Weight className="h-4 w-4 text-teal-500 mr-1" />
                              <span className="font-medium">
                                {patient.weight} kg
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">BMI:</span>
                            <span className="font-medium">{bmi}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">BMI Category:</span>
                            <Badge variant="outline" className={bmiInfo.color}>
                              {bmiInfo.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-teal-100 shadow-md">
                        <h3 className="text-lg font-medium text-teal-800 mb-4">
                          Blood Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Blood Type:</span>
                            <div className="flex items-center">
                              <Droplet className="h-4 w-4 text-red-500 mr-1" />
                              <span className="font-medium">
                                {bloodTypesMap[patient.bloodType as BloodType]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="mt-6 bg-white p-4 rounded-lg border border-teal-100 shadow-md">
                      <h3 className="text-lg font-medium text-teal-800 mb-4">
                        Medical Conditions
                      </h3>
                      <div className="space-y-3">
                        {conditionItems?.map((condition, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mt-0.5 mr-3 p-1 rounded-full bg-teal-100">
                              <Activity className="h-4 w-4 text-teal-600" />
                            </div>
                            <div>
                              <p className="text-gray-800">{condition}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                {/* Medical Documents Section */}
                <Card className="border-teal-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-teal-800 flex items-center">
                      <FileUp className="mr-2 h-5 w-5 text-teal-600" />
                      Medical Documents
                    </CardTitle>
                    <CardDescription>
                      Upload and manage patient medical records and documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* File Upload Component */}
                      <div className="bg-white p-6 rounded-lg border border-teal-100 shadow-sm">
                        <h3 className="text-lg font-medium text-teal-800 mb-4 flex items-center">
                          <FilePlus className="mr-2 h-5 w-5 text-teal-600" />
                          Upload Medical Documents
                        </h3>
                        <FileUpload
                          files={medicalDocuments}
                          onFilesAdded={handleFilesAdded}
                          onFileRemove={handleFileRemove}
                          maxFiles={10}
                          maxSize={10}
                          acceptedFileTypes={[
                            "application/pdf",
                            "image/jpeg",
                            "image/png",
                            "image/jpg",
                          ]}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
