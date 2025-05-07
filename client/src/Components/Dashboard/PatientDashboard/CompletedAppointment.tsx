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
import { Calendar, CheckCircle, Clock, Video } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Appointment } from "@/utils/types";
import { Link } from "react-router";
type Props = {
  appointment: Appointment;
};

const CompletedAppointments = ({ appointment }: Props) => {
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
        <CardHeader className="py-4 bg-gradient-to-r from-gray-100 to-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3 border-2 border-amber-200">
                <AvatarImage
                  src={appointment.doctorProfilePicture || "/placeholder.svg"}
                  alt={`${appointment.doctorFirstName} ${appointment.doctorLastName}`}
                />
                <AvatarFallback>
                  {appointment.doctorFirstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {appointment.doctorFirstName} {appointment.doctorLastName}
                </CardTitle>
                <p className="text-gray-500">Cardiology</p>
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
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-between w-full">
            <div></div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/book-appointment">
                  <Button className="bg-gradient-to-r text-white from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-md">
                    Book Follow-up
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CompletedAppointments;
