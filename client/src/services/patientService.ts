import { GetAllPatientsByDoctorsResponse } from "@/utils/types";
import axios from "axios";

export const getPatient = async (
  token: string | null,
  id: string | undefined
) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKENDURL}
/api/v1/patients/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getPatientsByDoctor = async (
  token: string | null,
  doctorId: number | undefined,
  searchTerm: string
): Promise<GetAllPatientsByDoctorsResponse> => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKENDURL}
/api/v1/doctor-patients/${doctorId}?search=${searchTerm}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const deletePatientByDoctor = async (
  token: string | null,
  doctorId: number | undefined,
  patientId: number | undefined
) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_BACKENDURL}
/api/v1/doctor-patients/delete?doctorId=${doctorId}&patientId=${patientId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
