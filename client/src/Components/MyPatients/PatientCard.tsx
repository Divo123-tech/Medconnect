import { Patient } from "@/utils/types";
import { motion } from "framer-motion";
import { Phone, Mail, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { BloodType } from "@/utils/types";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router";
import { bloodTypesMap, calculateBMI } from "@/utils/converters";
import { Button } from "../ui/button";
import { deletePatientByDoctor } from "@/services/patientService";
type Props = {
  patient: Patient;
  fetchPatients: () => void;
};

const PatientCard = ({ patient, fetchPatients }: Props) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };
  const { token, user } = useAuthStore();
  const handleDelete = async () => {
    try {
      await deletePatientByDoctor(token, user?.id, patient.id);
      fetchPatients();
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  return (
    <motion.div key={patient.id} variants={itemVariants} layout>
      <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border-teal-400 border cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <Link to={`/patient/${patient.id}`} className="flex items-center">
              <Avatar className="h-16 w-16 mr-4 border-2 border-teal-100">
                <AvatarImage
                  src={patient.profilePictureURL}
                  alt={`${patient.firstName} ${patient.lastName}`}
                />
                <AvatarFallback className="text-xl">
                  {patient.firstName.charAt(0)}
                  {patient.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {patient.firstName} {patient.lastName}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  DOB: {patient.dateOfBirth} • {patient.sex} • Blood Type:{" "}
                  {bloodTypesMap[patient.bloodType as BloodType]}
                </p>
              </div>
            </Link>
            <Button
              className="text-red-500 border-red-500 border cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Conditions</p>
                <p className="font-medium">{patient.conditions}</p>
              </div>
              <div>
                <p className="text-gray-500">Height</p>
                <p className="font-medium">{patient.height} cm</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Weight</p>
                <p className="font-medium">{patient.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-500">BMI</p>
                <p className="font-medium">
                  {Number(calculateBMI(patient.height, patient.weight))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>{patient.phoneNumber}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientCard;
