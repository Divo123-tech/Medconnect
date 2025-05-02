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
