import { create } from "zustand";
import { CallStatus, Offer } from "../utils/types";

interface CallStore {
  username: string;
  setUserName: (name: string) => void;
  callStatus: CallStatus;
  setCallStatus: (status: CallStatus) => void;

  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;

  remoteStream: MediaStream | null;
  setRemoteStream: (stream: MediaStream | null) => void;

  peerConnection: RTCPeerConnection | null;
  setPeerConnection: (pc: RTCPeerConnection | null) => void;

  userOfferTo: string;
  setUserOfferTo: (offerTo: string) => void;

  offerData: Offer | null;
  setOfferData: (data: Offer) => void;
}

export const useCallStore = create<CallStore>((set) => ({
  username: "",
  setUserName: (name) => set({ username: name }),

  callStatus: {
    audioEnabled: false,
    haveMedia: false,
    videoEnabled: false,
    answer: null,
  },
  setCallStatus: (status) => set({ callStatus: status }),

  localStream: null,
  setLocalStream: (stream) => set({ localStream: stream }),

  remoteStream: null,
  setRemoteStream: (stream) => set({ remoteStream: stream }),

  peerConnection: null,
  setPeerConnection: (pc) => set({ peerConnection: pc }),

  userOfferTo: "",
  setUserOfferTo: (offerTo) => set({ userOfferTo: offerTo }),

  offerData: null,
  setOfferData: (data) => set({ offerData: data }),
}));
