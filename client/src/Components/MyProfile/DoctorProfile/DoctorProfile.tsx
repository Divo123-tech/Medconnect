import type React from "react";
import { useState, useRef, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  X,
  User,
  Award,
  BookOpen,
  Stethoscope,
} from "lucide-react";

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
import { updateMyProfile } from "@/services/myProfileService";
import { useAuthStore } from "@/store/authStore";

// Define the Doctor type
type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialization: string;
  startedPracticingAt: string; // Using string for date handling in form
  education: string;
  bio: string;
  profilePictureURL: string;
};

type Props = {
  user: Doctor;
};

export default function DoctorProfile({ user }: Props) {
  const { token } = useAuthStore();

  const [doctor, setDoctor] = useState<Doctor>(user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [tempProfilePicture, setTempProfilePicture] = useState<string | null>(
    null
  );
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Urology",
  ];

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProfilePictureFile(file); // store the real file

      const reader = new FileReader();
      reader.onload = (event) => {
        setTempProfilePicture(event.target?.result as string); // still setting the preview
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      for (const key of Object.keys(doctor)) {
        console.log(key);
      }

      const userBlob = new Blob([JSON.stringify(doctor)], {
        type: "application/json",
      });

      formData.append("user", userBlob);
      // Append profile picture only if user selected a new one
      if (selectedProfilePictureFile) {
        formData.append("profilePicture", selectedProfilePictureFile); // must be a File object
      }
      // Call your PATCH API
      await updateMyProfile(token, formData);

      // Update profile picture if a new one was selected
      if (tempProfilePicture) {
        setDoctor((prev) => ({
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
      console.log(error);
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

  // Calculate years of experience
  const calculateExperience = () => {
    const startDate = new Date(doctor.startedPracticingAt);
    const currentDate = new Date();
    return currentDate.getFullYear() - startDate.getFullYear();
  };

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
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
                  <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-50 border-b border-teal-200 py-4">
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
                          src={
                            tempProfilePicture ||
                            `http://localhost:8080${doctor.profilePictureURL}`
                          }
                          alt="Profile"
                          className="object-cover w-full h-full" // You can adjust the width and height as needed
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

                {/* Doctor Information */}
                <Tabs defaultValue="personal" className="w-full ">
                  <TabsList className="grid w-full grid-cols-2 bg-teal-100 p-1">
                    <TabsTrigger
                      value="personal"
                      className="cursor-pointer data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-md text-teal-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Personal Information
                    </TabsTrigger>
                    <TabsTrigger
                      value="professional"
                      className="cursor-pointer data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-md text-teal-700"
                    >
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Professional Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-4">
                    <Card className="border-teal-200 shadow-lg overflow-hidden pt-0">
                      <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-50 border-b border-teal-200 py-4">
                        <CardTitle className="text-teal-800 flex items-center">
                          <User className="mr-2 h-5 w-5 text-teal-600" />
                          Personal Information
                        </CardTitle>
                        <CardDescription className="text-teal-700">
                          Update your personal details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                              value={doctor.firstName}
                              onChange={(e) =>
                                setDoctor({
                                  ...doctor,
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
                              value={doctor.lastName}
                              onChange={(e) =>
                                setDoctor({
                                  ...doctor,
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
                            value={doctor.email}
                            onChange={(e) =>
                              setDoctor({ ...doctor, email: e.target.value })
                            }
                            required
                            className="border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-teal-800">
                            Biography
                          </Label>
                          <Textarea
                            id="bio"
                            value={doctor.bio}
                            onChange={(e) =>
                              setDoctor({ ...doctor, bio: e.target.value })
                            }
                            placeholder="Write a short bio about yourself"
                            className="min-h-[150px] border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="professional" className="mt-4">
                    <Card className="border-teal-200 shadow-lg overflow-hidden pt-0">
                      <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-50 border-b border-teal-200 py-4">
                        <CardTitle className="text-teal-800 flex items-center">
                          <Award className="mr-2 h-5 w-5 text-teal-600" />
                          Professional Information
                        </CardTitle>
                        <CardDescription className="text-teal-700">
                          Update your professional details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 ">
                        <div className="space-y-2">
                          <Label
                            htmlFor="specialization"
                            className="text-teal-800"
                          >
                            Specialization
                          </Label>
                          <Select
                            value={doctor.specialization}
                            onValueChange={(value) =>
                              setDoctor({ ...doctor, specialization: value })
                            }
                          >
                            <SelectTrigger className="border-teal-200 focus:ring-teal-300 w-full">
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {specializations.map((specialization) => (
                                <SelectItem
                                  key={specialization}
                                  value={specialization}
                                  className={`hover:bg-teal-100 cursor-pointer ${
                                    specialization == doctor.specialization &&
                                    "bg-teal-100"
                                  }`}
                                >
                                  {specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="startedPracticingAt"
                            className="text-teal-800 flex items-center"
                          >
                            Started Practicing
                            <span className="ml-2 text-sm text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                              {calculateExperience()} years experience
                            </span>
                          </Label>
                          <Input
                            id="startedPracticingAt"
                            type="date"
                            value={doctor.startedPracticingAt}
                            onChange={(e) =>
                              setDoctor({
                                ...doctor,
                                startedPracticingAt: e.target.value,
                              })
                            }
                            required
                            className="border-teal-200 focus:border-teal-400 focus:ring-teal-300 w-full "
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="education"
                            className="text-teal-800 flex items-center"
                          >
                            <BookOpen className="mr-2 h-4 w-4 text-teal-600" />
                            Education & Qualifications
                          </Label>
                          <Textarea
                            id="education"
                            value={doctor.education}
                            onChange={(e) =>
                              setDoctor({
                                ...doctor,
                                education: e.target.value,
                              })
                            }
                            placeholder="List your degrees, certifications, and educational background"
                            className="min-h-[150px] border-teal-200 focus:border-teal-400 focus:ring-teal-300"
                          />
                          <p className="text-xs text-teal-600">
                            Include degrees, board certifications, fellowships,
                            and other relevant qualifications.
                          </p>
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
    </>
  );
}
