import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Offer } from "@/utils/types";
import { motion } from "framer-motion";
import { Clock, Video } from "lucide-react";

type Props = {
  availableCall: Offer;
  answer: (callData: Offer) => void;
};

const CallNotification = ({ availableCall, answer }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 rgba(16, 185, 129, 0.4)",
            "0 0 20px rgba(16, 185, 129, 0.7)",
            "0 0 0 rgba(16, 185, 129, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
        className="bg-gradient-to-r from-teal-50 to-green-50 border-l-4 border-teal-500 rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white mr-3">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-teal-800">
                  Patient Waiting Room
                </h2>
                <p className="text-teal-600 text-sm">
                  A patient is waiting to join a video call with you
                </p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="h-3 w-3 bg-green-500 rounded-full"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-teal-200">
                  <AvatarImage src={""} alt={availableCall?.offererFullName} />
                  <AvatarFallback>
                    {availableCall?.offererFullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <Video className="h-3 w-3" />
                </motion.div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">
                  {availableCall?.offererFullName}
                </h3>

                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-teal-600 mr-1" />
                  <span className="text-xs text-teal-600">
                    {availableCall?.scheduledTime}
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="flex-1 bg-white/60 rounded-md p-3 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Appointment:</span>
            <span className="font-medium">
              {waitingPatient.appointmentType}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Scheduled Time:</span>
            <span className="font-medium">
              {waitingPatient.appointmentTime}
            </span>
          </div>
        </div> */}

            <div className="flex gap-2 ml-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => answer(availableCall)}
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white shadow-lg"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Join Video Call Now
                </Button>
              </motion.div>
              <Button
                variant="outline"
                size="lg"
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallNotification;
