const clientSocketListeners = (
  socket,
  typeOfCall,
  callStatus,
  setCallStatus,
  peerConnection,
  setRemoteStream
) => {
  socket.on("answerResponse", (entireOfferObj) => {
    console.log(entireOfferObj);
    const copyCallStatus = { ...callStatus };
    copyCallStatus.answer = entireOfferObj.answer;
    copyCallStatus.myRole = typeOfCall;
    setCallStatus(copyCallStatus);
  });

  socket.on("receivedIceCandidateFromServer", (iceC) => {
    if (iceC) {
      peerConnection.addIceCandidate(iceC).catch((err) => {
        console.log("Chrome thinks there is an error. There isn't...");
      });
      console.log(iceC);
      console.log("Added an iceCandidate to existing page presence");
      // setShowCallInfo(false);
    }
  });

  socket.on("hangup", () => {
    console.log("SOMEONE HUNG UP");
    setRemoteStream((prevRemoteStream) => {
      if (!prevRemoteStream) return null; // Ensure it's not null

      // Stop all tracks in the MediaStream
      prevRemoteStream.getTracks().forEach((track) => track.stop());

      return new MediaStream(); // ✅ Replace with a new empty stream
    });
  });
};

export default clientSocketListeners;
