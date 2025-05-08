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

const CompletedAppointment = ({ appointment }: Props) => {
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
      <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300 pt-0">
        <CardHeader className="py-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3 border-2 border-gray-200">
                <AvatarImage
                  src={appointment.patientProfilePicture || "/placeholder.svg"}
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
              <div>
                <CardTitle className="text-lg">
                  {appointment.patientFirstName} {appointment.patientLastName}
                </CardTitle>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              {appointment.date}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              {appointment.time}
            </div>
            <div className="flex items-center text-gray-600">
              <Video className="h-4 w-4 mr-1 text-gray-500" />
              Video Call
            </div>
          </div>
          {appointment.reason && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-600 border border-gray-100">
              <p className="font-medium text-gray-700 mb-1">Notes:</p>
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

export default CompletedAppointment;
