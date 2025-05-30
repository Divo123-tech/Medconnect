import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Shield, UserPlus, CheckCircle, Eye, EyeOff } from "lucide-react";
import { DoctorInfo } from "@/utils/types";
import { registerDoctor } from "@/services/doctorService";
import { useAuthStore } from "@/store/authStore";

const SECRET_KEY = import.meta.env.VITE_ADMIN_KEY;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { token } = useAuthStore();
  const [formData, setFormData] = useState<DoctorInfo>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    specialization: "",
    startedPracticingAt: "",
    education: "",
    bio: "",
  });

  const handleSecretKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey === SECRET_KEY) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid secret key. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);

    // Simulate API call
    await registerDoctor(token, { secretKey, doctorInfo: formData });

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      specialization: "",
      startedPracticingAt: "",
      education: "",
      bio: "",
    });

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/4"
        >
          <Card className="w-full bg-white border-gray-200 border">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Admin Access
              </CardTitle>
              <CardDescription>
                Enter the secret key to access admin functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecretKeySubmit} className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key"
                    className="w-full border-gray-200 border"
                  />
                </div>

                {authError && (
                  <Alert variant="destructive" className="border-red-500">
                    <AlertDescription className=" text-red-500">
                      {authError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!secretKey.trim()}
                >
                  Access Admin Panel
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-gray-600">Register new doctors to the platform</p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6"
            >
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Doctor registered successfully! You can now register another
                  doctor.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Doctor Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-gray-200 border shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Register New Doctor
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill in all the required information to add a new doctor to the
                platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDoctorSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                      className="border-gray-300 border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                      className="border-gray-300 border"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="doctor@example.com"
                    required
                    className="border-gray-300 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter secure password"
                      required
                      className="border-gray-300 border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Cardiology, Neurology"
                      required
                      className="border-gray-300 border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startedPracticingAt">
                      Started Practicing *
                    </Label>
                    <Input
                      id="startedPracticingAt"
                      name="startedPracticingAt"
                      type="date"
                      value={formData.startedPracticingAt}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education *</Label>
                  <Input
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="e.g., Harvard Medical School"
                    required
                    className="border-gray-300 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Enter doctor's professional bio and expertise..."
                    className="min-h-[120px] resize-none border-gray-300 border"
                    maxLength={500}
                    required
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {formData.bio.length}/500 characters
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Registering Doctor...
                    </div>
                  ) : (
                    "Register Doctor"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
