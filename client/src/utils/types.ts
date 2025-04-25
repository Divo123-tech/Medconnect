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