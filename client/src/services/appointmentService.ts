import { Appointment, Doctor } from "@/utils/types";
import axios from "axios";

export const createAppointment = async (
  token: string | null,
  doctorId: number | undefined,
  date: string | undefined,
  time: string | null,
  reason: string
) => {
  const res = await axios.post(
    `http://localhost:8080/api/v1/appointments`,
    {
      doctorId,
      date,
      time,
      reason,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getAppointments = async (token: string | null, status: string) => {
  const res = await axios.get(
    `http://localhost:8080/api/v1/appointments?status=${status}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const getAppointmentById = async (
  token: string | null,
  id: string
): Promise<Appointment> => {
  const res = await axios.get(
    `http://localhost:8080/api/v1/appointments/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const getAppointmentsForDoctor = async (
  token: string | null,
  status: string
) => {
  const res = await axios.get(
    `http://localhost:8080/api/v1/appointments/doctor?status=${status}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateAppointmentStatus = async (
  token: string | null,
  id: string | number,
  status: string
) => {
  const res = await axios.patch(
    `http://localhost:8080/api/v1/appointments/${id}`,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateAppointment = async (
  token: string | null,
  id: string | undefined,
  updatedAppointment: {
    doctorId: number | undefined;
    time: string | null;
    date: string | undefined;
    reason: string;
  }
) => {
  const res = await axios.patch(
    `http://localhost:8080/api/v1/appointments/${id}`,
    updatedAppointment,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
