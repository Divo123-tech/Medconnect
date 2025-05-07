import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Calendar, CheckCircle, Clock, Video } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Appointment } from "@/utils/types";
import prepForCall from "@/utils/webrtcUtilities/prepForCall";
import { useCallStore } from "@/store/webrtcStore";
import { useEffect, useRef, useState } from "react";
import createPeerConnection from "@/utils/webrtcUtilities/createPeerConn";
import socketConnection from "@/utils/webrtcUtilities/socketConnection";
import clientSocketListeners from "@/utils/webrtcUtilities/clientSocketListeners";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";

type Props = {
  appointment: Appointment;
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
};

const ConfirmedAppointments = ({
  appointment,
  remoteStream,
  setRemoteStream,
}: Props) => {
  const [typeOfCall, setTypeOfCall] = useState<string>("");
  const navigate = useNavigate();
  const hasInitialized = useRef(false);
  const [joined, setJoined] = useState(false);
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
  const {
    callStatus,
    setCallStatus,
    setLocalStream,
    peerConnection,
    setPeerConnection,
    localStream,
    setOfferData,
    setUserOfferTo,
    offerData,
  } = useCallStore();
  //Nothing happens until the user clicks join
  //(Helps with React double render)
  useEffect(() => {
    if (joined) {
      setUserOfferTo(appointment.doctorEmail);
      const socket = socketConnection(appointment.patientEmail);

      //emitting get offers
      socket?.emit("getOffers");
    }
  }, [
    appointment.doctorEmail,
    appointment.patientEmail,
    joined,
    setUserOfferTo,
  ]);
  //We have media via GUM. setup the peerConnection w/listeners
  useEffect(() => {
    console.log("signaling state", peerConnection);
    console.log("Call status", callStatus);
    if (
      callStatus.haveMedia &&
      (!peerConnection || peerConnection.signalingState == "closed")
    ) {
      // prepForCall has finished running and updated callStatus
      console.log("NEW PEER CONNECTION");
      const createdPeerConnection = createPeerConnection(
        appointment.patientEmail,
        typeOfCall
      );
      if (createdPeerConnection == undefined) {
        return;
      } else {
        const { peerConnection, remoteStream } = createdPeerConnection;
        setPeerConnection(peerConnection);
        setRemoteStream(remoteStream);
      }
    }
  }, [
    appointment.patientEmail,
    callStatus,
    peerConnection,
    setPeerConnection,
    setRemoteStream,
    typeOfCall,
  ]);

  //We know which type of client this is and have PC.
  //Add socketlisteners
  useEffect(() => {
    if (
      !hasInitialized.current &&
      typeOfCall &&
      peerConnection &&
      localStream
    ) {
      hasInitialized.current = true;

      const socket = socketConnection(appointment.patientEmail);
      clientSocketListeners(
        socket,
        typeOfCall,
        localStream,
        callStatus,
        setCallStatus,
        peerConnection,
        setRemoteStream
      );
    }
  }, [
    typeOfCall,
    peerConnection,
    localStream,
    callStatus,
    setCallStatus,
    setRemoteStream,
    appointment.patientEmail,
  ]);

  //once remoteStream AND pc are ready, navigate
  useEffect(() => {
    if (remoteStream && peerConnection) {
      if (typeOfCall) {
        navigate(`/${typeOfCall}?token=${Math.random()}`);
      } else {
        navigate("/");
      }
    }
  }, [remoteStream, peerConnection, typeOfCall, navigate]);
  //called on "Call" or "Answer"
  const initCall = async (typeOfCall: string) => {
    // set localStream and GUM
    await prepForCall(callStatus, setCallStatus, setLocalStream);
    // console.log("gum access granted!")

    setTypeOfCall(typeOfCall); //offer or answer
  };
  const call = async () => {
    //call related stuff goes here

    initCall("offer");
    setOfferData({
      offererFullName: `${appointment.patientFirstName} ${appointment.patientLastName}`,
      offererUserName: offerData?.offererUserName || "", // provide a default if undefined
      offer: offerData?.offer || undefined, // no change if undefined
      scheduledTime: appointment.time.slice(0, 5), // provide a default if undefined
      appointmentId: appointment.id,
      offerIceCandidates: offerData?.offerIceCandidates || [], // default empty array if undefined
      answererUserName: offerData?.answererUserName || null, // default to null if undefined
      answer: offerData?.answer || undefined, // no change if undefined
      answererIceCandidates: offerData?.answererIceCandidates || [], // default empty array if undefined
      offeringTo: offerData?.offeringTo || "", // provide a default if undefined
    });
  };
  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
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
                    src={appointment.doctorProfilePicture || "/placeholder.svg"}
                    alt={appointment.doctorFirstName}
                  />
                  <AvatarFallback>
                    {appointment.doctorFirstName.charAt(0) +
                      appointment.doctorLastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  variants={pulseVariants}
                  animate="pulse"
                  className="absolute -bottom-1 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <Video className="h-3 w-3" />
                </motion.div>
              </div>
              <div className="">
                <CardTitle className="text-lg">
                  {appointment.doctorFirstName} {appointment.doctorLastName}
                </CardTitle>
                <p className="text-gray-500">specialization</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Confirmed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="">
          <div className="flex w-full">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1 text-teal-600" />
                {appointment.date}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1 text-teal-600" />
                {appointment.time.slice(0, 5)}
              </div>
              <div className="flex items-center text-gray-600">
                <Video className="h-4 w-4 mr-1 text-teal-600" />
                Video Call
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setJoined(true)}
                      className="cursor-pointer bg-gradient-to-r text-white from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Join Video Call
                    </Button>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full bg-gradient-to-br from-teal-50 via-white to-teal-100 rounded-lg shadow-lg p-6"
                  >
                    <DialogHeader className="flex flex-col items-center space-y-4">
                      <div className="bg-teal-100 text-teal-700 p-4 rounded-full">
                        <Video className="w-8 h-8" />
                      </div>
                      <DialogTitle className="text-lg text-center text-teal-900 font-semibold">
                        Before you enter the meeting...
                      </DialogTitle>
                    </DialogHeader>

                    <div className="text-sm text-gray-700 text-center mt-4 px-2">
                      <p>
                        Please{" "}
                        <span className="font-semibold text-teal-700">
                          do not hang up
                        </span>{" "}
                        once you're in the meeting room. Leaving the call will
                        end the appointment.
                        <br />
                        <br />
                        Kindly{" "}
                        <span className="font-semibold text-teal-700">
                          wait patiently
                        </span>{" "}
                        for the doctor to join. Thank you for your
                        understanding.
                      </p>
                    </div>

                    <DialogFooter className="pt-6 flex justify-center">
                      <Button
                        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 px-6 py-2 rounded-lg"
                        onClick={call}
                      >
                        I understand, proceed to call
                      </Button>
                    </DialogFooter>
                  </motion.div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConfirmedAppointments;
