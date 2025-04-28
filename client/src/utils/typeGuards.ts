import { Doctor, Patient } from "./types";

export const isPatient = (user: Patient | Doctor): user is Patient => {
  return "height" in user;
};

export const isDoctor = (user: Patient | Doctor): user is Doctor => {
  return "education" in user;
};
