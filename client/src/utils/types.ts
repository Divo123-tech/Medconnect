export type SDP = { sdp: string; type: string };
export type CallStatus = {
  audioEnabled: boolean;
  haveMedia: boolean;
  videoEnabled: boolean | null;
  answer: RTCSessionDescriptionInit | null;
  myRole: string;
  current: string;
};
export type IceCandidate = {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
};

export type Offer = {
  offererUserName: string;
  offer: RTCSessionDescriptionInit | undefined;
  offerIceCandidates: IceCandidate[];
  answererUserName: string | null;
  answer: RTCSessionDescriptionInit | undefined;
  answererIceCandidates: IceCandidate[];
  offeringTo: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};


export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  height: number;
  weight: number;
  bloodType: string;
  conditions: string;
  profilePictureURL: string;
};

export type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  specialization: string;
  startedPracticingAt: string; // ISO date string like "2020-04-25"
  education: string;
  bio: string;
  profilePictureURL: string;
};