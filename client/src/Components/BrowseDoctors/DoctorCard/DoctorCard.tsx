import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Doctor } from "@/utils/types";
import { motion } from "framer-motion";
import { Award, BookOpen, Calendar } from "lucide-react";
import { Link } from "react-router";

type Props = {
  doctor: Doctor;
};

const DoctorCard = ({ doctor }: Props) => {
  // Calculate years of experience based on startedPracticingAt
  const calculateYearsExperience = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  };
  const yearsExperience = calculateYearsExperience(doctor.startedPracticingAt);
  return (
    <motion.div
      key={doctor.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className="bg-white overflow-hidden cursor-pointer border-teal-100 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-start">
            <Avatar className="relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100 border-2 border-teal-200">
              <AvatarImage
                src={doctor.profilePictureURL}
                alt={`${doctor.firstName} ${doctor.lastName}`}
              />
              <AvatarFallback className="text-2xl">
                {doctor.firstName.charAt(0)}
                {doctor.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
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
                {new Date(doctor.startedPracticingAt).getFullYear()}
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

          <p className="mt-4 text-gray-600 text-sm line-clamp-3">
            {doctor.bio}
          </p>
        </div>

        <div className="px-6 flex justify-between items-center">
          <Link to={`/doctor/${doctor.id}`}>
            <Button
              variant="outline"
              className="border-teal-200 cursor-pointer text-teal-700 hover:bg-teal-50"
            >
              View Profile
            </Button>
          </Link>
          <Link to={"/book-appointment"}>
            <Button className="cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
              Book Appointment
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;
