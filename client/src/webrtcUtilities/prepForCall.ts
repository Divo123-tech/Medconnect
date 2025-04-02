//Share this function for both sides, answer and caller
// because both sides need to do this same thing before
// we can move forward

const prepForCall = async (callStatus, setCallStatus, setLocalStream) => {
  //can bring constraints in as a param
  const constraints = {
    video: true, //must have one constraint, dont have to show it yet
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    //set bools
    const copyCallStatus = { ...callStatus };
    copyCallStatus.haveMedia = true; //signals to the app that we have media
    copyCallStatus.videoEnabled = null; //init both to false, you can init to true
    copyCallStatus.audioEnabled = false;
    setCallStatus(copyCallStatus);

    setLocalStream(stream);
  } catch (err) {
    console.log(err);
  }
};

export default prepForCall;
