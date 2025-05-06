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
import { Bell, Calendar, Clock, Video } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Appointment } from "@/utils/types";
import { Link } from "react-router";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/Components/ui/dialog";
import { useState } from "react";
import { updateAppointmentStatus } from "@/services/appointmentService";
import { useAuthStore } from "@/store/authStore";

type Props = {
  appointment: Appointment;
  onStatusChange: () => void;
};

const PendingAppointments = ({ appointment, onStatusChange }: Props) => {
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { token } = useAuthStore();
  const cancelAppointment = async () => {
    await updateAppointmentStatus(token, appointment.id, "CANCELLED");
    console.log(appointment?.id);
    onStatusChange();
    setIsDialogOpen(false);
  };
  return (
    <motion.div
      key={appointment.id}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border-amber-100 hover:shadow-lg transition-all duration-300 pt-0">
        <CardHeader className="py-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3 border-2 border-amber-200">
                <AvatarImage
                  src={appointment.doctorProfilePicture || "/placeholder.svg"}
                  alt={
                    appointment.doctorFirstName +
                    " " +
                    appointment.doctorLastName
                  }
                />
                <AvatarFallback>
                  {appointment.doctorFirstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  Dr. {appointment.doctorFirstName} {appointment.doctorLastName}
                </CardTitle>
                <p className="text-gray-500">Cardiology</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 flex items-center gap-1">
              <Bell className="h-3 w-3" />
              Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1 text-amber-600" />
              {appointment.date}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-amber-600" />
              {appointment.time.slice(0, 5)}
            </div>
            <div className="flex items-center text-gray-600">
              <Video className="h-4 w-4 mr-1 text-amber-600" />
              Video Call
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex justify-between w-full">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </DialogTrigger>

              <DialogContent className="bg-teal-50 border-teal-300">
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This will cancel your appointment with Dr.{" "}
                    {appointment.doctorFirstName} {appointment.doctorLastName}.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-white border border-gray-400 hover:bg-gray-100 cursor-pointer"
                  >
                    No, go back
                  </Button>
                  <Button
                    className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                    onClick={cancelAppointment}
                  >
                    Yes, cancel it
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={`/edit-appointment/${appointment.id}`}>
                  <Button className="cursor-pointer text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md">
                    Edit
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

export default PendingAppointments;
