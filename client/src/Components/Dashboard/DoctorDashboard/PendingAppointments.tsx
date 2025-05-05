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
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Video,
  XCircle,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Appointment } from "@/utils/types";
type Props = {
  appointment: Appointment;
};

const PendingAppointments = ({ appointment }: Props) => {
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
      <Card className="overflow-hidden border-amber-100 hover:shadow-lg transition-all duration-300 pt-0">
        <CardHeader className="py-2 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3 border-2 border-amber-200">
                <AvatarImage
                  src={appointment?.patientProfilePicture || "/placeholder.svg"}
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
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 flex items-center gap-1">
              <Bell className="h-3 w-3" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-4 text-sm mb-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1 text-amber-600" />
              {appointment.date}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-amber-600" />
              {appointment.time}
            </div>
            <div className="flex items-center text-gray-600">
              <Video className="h-4 w-4 mr-1 text-amber-600" />
              Video Call
            </div>
          </div>

          {appointment.reason && (
            <div className="mt-3 p-3 bg-amber-50 rounded-md text-sm text-gray-600 border border-amber-100">
              <p className="font-medium text-amber-700 mb-1">
                Patient's Reason:
              </p>
              <p>{appointment.reason}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-between w-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </motion.div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="text-white cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Appointment
                </Button>
              </motion.div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PendingAppointments;
