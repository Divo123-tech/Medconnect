import { Appointment } from "@/utils/types";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Calendar, CheckCircle, Clock, User, Video } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Link } from "react-router";
type Props = {
  appointment: Appointment;
};

const ConfirmedAppointments = ({ appointment }: Props) => {
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

  return (
    <motion.div
      key={appointment.id}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border-teal-100 hover:shadow-lg transition-all duration-300 pt-0">
        <CardHeader className="py-4 bg-gradient-to-r from-teal-100 to-teal-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-12 w-12 mr-3 border-2 border-teal-200">
                  <AvatarImage
                    src={
                      appointment.patientProfilePicture || "/placeholder.svg"
                    }
                    alt={
                      appointment.patientFirstName +
                      " " +
                      appointment.patientLastName
                    }
                  />
                  <AvatarFallback>
                    {appointment.patientFirstName.charAt(0) +
                      appointment.patientLastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <CardTitle className="text-lg">
                  {appointment.patientFirstName} {appointment.patientLastName}
                </CardTitle>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Confirmed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          <div className="flex flex-wrap gap-4 text-sm mb-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1 text-teal-600" />
              {appointment.date}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-teal-600" />
              {appointment.time}
            </div>
            <div className="flex items-center text-gray-600">
              <Video className="h-4 w-4 mr-1 text-teal-600" />
              Video Call
            </div>
          </div>

          {appointment.reason && (
            <div className="mt-3 p-3 bg-teal-50 rounded-md text-sm text-gray-600 border border-teal-100">
              <p className="font-medium text-teal-700 mb-1">
                Patient's Reason:
              </p>
              <p>{appointment.reason}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-between w-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/patient/${appointment.patientId}`}>
                <Button
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <User className="mr-2 h-4 w-4" />
                  View Patient Info
                </Button>
              </Link>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConfirmedAppointments;
