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
  offererFullName: string;
  scheduledTime: string;
  appointmentId: string | number;
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

export type LoginRequest = {
  email: string;
  password: string;
};
export type BloodType =
  | "A_POS"
  | "A_NEG"
  | "B_POS"
  | "B_NEG"
  | "AB_POS"
  | "AB_NEG"
  | "O_POS"
  | "O_NEG";
export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  height: number;
  weight: number;
  bloodType: BloodType;
  conditions: string;
  profilePictureURL: string;
};

export type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialization: string;
  startedPracticingAt: string; // ISO date string like "2020-04-25"
  education: string;
  bio: string;
  profilePictureURL: string;
};

type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type GetAllDoctorsResponse = {
  content: Doctor[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
};
export type Appointment = {
  id: number;
  doctorId: number;
  patientId: number;

  doctorFirstName: string;
  doctorLastName: string;
  doctorProfilePicture: string;
  doctorEmail: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientProfilePicture: string;

  date: string; // format: "YYYY-MM-DD"
  time: string; // format: "HH:mm" (24-hour)

  reason: string;

  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; // or use enum if you have it
};