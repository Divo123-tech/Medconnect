import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Activity,
  Ruler,
  Weight,
  Droplet,
  FileText,
  Lock,
  AlertCircle,
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

// Using the exact Patient type as provided
export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  height: number;
  weight: number;
  bloodType: string;
  conditions: string;
  profilePictureURL: string;
};

export default function PatientDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDoctor, setIsDoctor] = useState(true); // In a real app, this would be determined by authentication

  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call with proper authentication
        // For demo purposes, we'll simulate an API call with a timeout
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock data for the patient
        const mockPatient: Patient = {
          id: Number(params.id),
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          role: "patient",
          phoneNumber: "+1 (555) 123-4567",
          height: 175, // cm
          weight: 70, // kg
          bloodType: "O+",
          conditions:
            "Mild asthma, seasonal allergies\nHypertension\nMigraine headaches\nLactose intolerance",
          profilePictureURL: "/placeholder.svg?height=400&width=400",
        };

        setPatient(mockPatient);
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError("Failed to load patient profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPatient();
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

  // Calculate BMI
  const calculateBMI = (height: number, weight: number) => {
    // Height in meters (convert from cm)
    const heightInMeters = height / 100;
    // BMI formula: weight (kg) / (height (m))^2
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Get BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5)
      return {
        category: "Underweight",
        color: "text-blue-600 bg-blue-50 border-blue-200",
      };
    if (bmi < 25)
      return {
        category: "Normal weight",
        color: "text-green-600 bg-green-50 border-green-200",
      };
    if (bmi < 30)
      return {
        category: "Overweight",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      };
    return {
      category: "Obese",
      color: "text-red-600 bg-red-50 border-red-200",
    };
  };

  // Access control - only doctors should see this page
  if (!isDoctor && !isLoading) {
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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
        <header className="bg-gradient-to-r from-teal-500 to-teal-600 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <Link
              to="/patients"
              className="flex items-center text-white hover:text-teal-100 mr-4"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span className="text-sm">Back to Patients</span>
            </Link>
            <h1 className="text-xl font-semibold text-white">
              Loading Patient Profile...
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-teal-700 font-medium">
              Loading patient information...
            </p>
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
  const conditionItems = patient.conditions.split("\n");

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link
            to="/patients"
            className="flex items-center text-white hover:text-teal-100 mr-4"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span className="text-sm">Back to Patients</span>
          </Link>
          <h1 className="text-xl font-semibold text-white">Patient Profile</h1>
          <Badge className="ml-auto bg-red-500 hover:bg-red-600">
            Doctor View Only
          </Badge>
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
                      src={patient.profilePictureURL || "/placeholder.svg"}
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
                  value="notes"
                  className="data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-md text-teal-700"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Doctor Notes
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
                                {patient.bloodType}
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
                        {conditionItems.map((condition, index) => (
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

              <TabsContent value="notes" className="mt-4">
                {/* Doctor's Notes Section */}
                <Card className="border-teal-100 shadow-md bg-white">
                  <CardHeader>
                    <CardTitle className="text-teal-800 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-teal-600" />
                      Doctor's Notes
                    </CardTitle>
                    <CardDescription>
                      Private notes for medical staff only
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Patient has expressed anxiety about blood pressure
                            medication side effects. Take time to address
                            concerns during next visit.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">
                            Dr. Sarah Johnson
                          </h4>
                          <span className="text-sm text-gray-500">
                            2 weeks ago
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Patient reports occasional headaches, possibly related
                          to stress or hypertension. Recommended lifestyle
                          modifications including reduced sodium intake and
                          regular exercise. Blood work shows slightly elevated
                          cholesterol levels. Will reassess in 3 months.
                        </p>
                      </div>

                      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">
                            Dr. Michael Chen
                          </h4>
                          <span className="text-sm text-gray-500">
                            3 months ago
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          Patient experiencing seasonal allergy symptoms.
                          Prescribed antihistamine and nasal spray. Asthma
                          appears well-controlled with current medication
                          regimen. No changes to treatment plan at this time.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                        <FileText className="mr-2 h-4 w-4" />
                        Add New Note
                      </Button>
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
