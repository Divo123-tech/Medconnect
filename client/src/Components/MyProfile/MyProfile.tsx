"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  X,
  User,
  Heart,
  Activity,
} from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import PhoneInput from "./PhoneInput";
// Define the Patient type
type Patient = {
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

export default function ProfilePage() {
  // Mock patient data - in a real app, this would come from your API
  const [patient, setPatient] = useState<Patient>({
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "patient",
    phoneNumber: "+15551234567",
    height: 175, // cm
    weight: 70, // kg
    bloodType: "O+",
    conditions: "Mild asthma, seasonal allergies",
    profilePictureURL: "/placeholder.svg?height=200&width=200",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [tempProfilePicture, setTempProfilePicture] = useState<string | null>(
    null
  );
  const [phoneValue, setPhoneValue] = useState<string>(patient.phoneNumber);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Update patient phone number when phoneValue changes
  useEffect(() => {
    if (phoneValue) {
      setPatient((prev) => ({ ...prev, phoneNumber: phoneValue }));
    }
  }, [phoneValue]);

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update profile picture if a new one was selected
      if (tempProfilePicture) {
        setPatient((prev) => ({
          ...prev,
          profilePictureURL: tempProfilePicture,
        }));
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      setFormError("Failed to update profile. Please try again.");
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <div className="flex items-center px-16 pt-2">
        <Link
          to="/dashboard"
          className="flex items-center text-teal-800 mr-4 text-lg hover:border-b hover:opacity-80"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <Card className="border-teal-200 shadow-lg overflow-hidden pt-0">
                  <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-50 py-4">
                    <CardTitle className="text-teal-800 flex items-center">
                      <User className="mr-2 h-5 w-5 text-teal-600" />
                      Profile Picture
                    </CardTitle>
                    <CardDescription className="text-teal-700">
                      Update your profile photo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 border-4 border-teal-300 shadow-md">
                        <img
                          src={tempProfilePicture || patient.profilePictureURL}
                          alt="Profile"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center border-teal-300 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Change Photo
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleProfilePictureChange}
                          accept="image/*"
                          className="hidden"
                        />
                        {tempProfilePicture && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setTempProfilePicture(null)}
                            className="flex items-center text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove New Photo
                          </Button>
                        )}
                        <p className="text-sm text-teal-700">
                          Recommended: Square JPG, PNG. Max 1MB.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-teal-100 px-1">
                    <TabsTrigger
                      value="personal"
                      className="data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-md text-teal-700 cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Personal Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="medical"
                      className="data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-md text-teal-700 cursor-pointer"
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Medical Information
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-4">
                    <Card className="border-teal-200 shadow-lg overflow-hidden pt-0">
                      <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-50 border-teal-200 py-4">
                        <CardTitle className="text-teal-800 flex items-center">
                          <User className="mr-2 h-5 w-5 text-teal-600" />
                          Personal Information
                        </CardTitle>
                        <CardDescription className="text-teal-700">
                          Update your personal details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        {formError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 mb-4 bg-red-50 border border-red-300 rounded-lg text-red-600"
                          >
                            <div className="flex items-start">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{formError}</span>
                            </div>
                          </motion.div>
                        )}

                        {isSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-3 mb-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-600"
                          >
                            <div className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Profile updated successfully!</span>
                            </div>
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-teal-800"
                            >
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={patient.firstName}
                              onChange={(e) =>
                                setPatient({
                                  ...patient,
                                  firstName: e.target.value,
                                })
                              }
                              required
                              className="border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-teal-800">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={patient.lastName}
                              onChange={(e) =>
                                setPatient({
                                  ...patient,
                                  lastName: e.target.value,
                                })
                              }
                              required
                              className="border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-teal-800">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={patient.email}
                            onChange={(e) =>
                              setPatient({ ...patient, email: e.target.value })
                            }
                            required
                            className="border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phoneNumber"
                            className="text-teal-800"
                          >
                            Phone Number
                          </Label>
                          <PhoneInput
                            value={phoneValue}
                            onChange={(value) => setPhoneValue(value || "")}
                            defaultCountry="US"
                            className="w-full"
                            inputclassname="border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="medical" className="mt-4">
                    <Card className="border-teal-200 shadow-lg overflow-hidden pt-0">
                      <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-50 py-4">
                        <CardTitle className="text-teal-800 flex items-center">
                          <Activity className="mr-2 h-5 w-5 text-teal-600" />
                          Medical Information
                        </CardTitle>
                        <CardDescription className="text-teal-700">
                          Update your medical details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="height" className="text-teal-800">
                              Height (cm)
                            </Label>
                            <Input
                              id="height"
                              type="number"
                              value={patient.height}
                              onChange={(e) =>
                                setPatient({
                                  ...patient,
                                  height: Number(e.target.value),
                                })
                              }
                              required
                              className="border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="weight" className="text-teal-800">
                              Weight (kg)
                            </Label>
                            <Input
                              id="weight"
                              type="number"
                              value={patient.weight}
                              onChange={(e) =>
                                setPatient({
                                  ...patient,
                                  weight: Number(e.target.value),
                                })
                              }
                              required
                              className="border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bloodType" className="text-teal-800">
                            Blood Type
                          </Label>
                          <Select
                            value={patient.bloodType}
                            onValueChange={(value) =>
                              setPatient({ ...patient, bloodType: value })
                            }
                          >
                            <SelectTrigger className="border-teal-200 focus:ring-teal-300 w-full">
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {bloodTypes.map((type) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className={`hover:bg-gray-100 cursor-pointer ${
                                    type == patient.bloodType && "bg-gray-100"
                                  }`}
                                >
                                  <span className="flex items-center">
                                    <Heart className="mr-2 h-4 w-4 text-red-500" />
                                    {type}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="conditions" className="text-teal-800">
                            Medical Conditions
                          </Label>
                          <Textarea
                            id="conditions"
                            value={patient.conditions}
                            onChange={(e) =>
                              setPatient({
                                ...patient,
                                conditions: e.target.value,
                              })
                            }
                            placeholder="List any medical conditions, allergies, or important health information"
                            className="min-h-[120px] border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Save Button */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => (window.location.href = "/dashboard")}
                    className="border-teal-300 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>

      {/* Add some additional styles to fix the phone input appearance */}
      <style>{`
        /* These minimal styles are needed to fix some issues with the phone input */
        .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          overflow: hidden;
        }

        .PhoneInputCountrySelectArrow {
          margin-left: 5px;
          width: 8px;
          height: 8px;
          border-style: solid;
          border-color: #0d9488;
          border-width: 0 1px 1px 0;
          display: inline-block;
          transform: rotate(45deg);
        }

        .PhoneInputCountry {
          margin-right: 8px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
