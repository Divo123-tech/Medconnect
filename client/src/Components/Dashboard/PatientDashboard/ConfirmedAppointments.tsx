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
type Props = {
  appointment: any;
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
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
        <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-50 py-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-12 w-12 mr-3 border-2 border-teal-200">
                  <AvatarImage
                    src={appointment.doctorImage || "/placeholder.svg"}
                    alt={appointment.doctorName}
                  />
                  <AvatarFallback>
                    {appointment.doctorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {appointment.type === "video" && (
                  <motion.div
                    variants={pulseVariants}
                    animate="pulse"
                    className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <Video className="h-3 w-3" />
                  </motion.div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {appointment.doctorName}
                </CardTitle>
                <p className="text-gray-500">{appointment.doctorSpecialty}</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Confirmed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
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
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="text-teal-600 border-teal-300 hover:bg-red-50"
                >
                  Edit
                </Button>
              </motion.div>
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r text-white from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md">
                  <Video className="mr-2 h-4 w-4" />
                  Join Video Call
                </Button>
              </motion.div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConfirmedAppointments;
