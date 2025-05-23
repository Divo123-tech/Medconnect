import axios from "axios";

export const createReview = async (
  token: string | null,
  doctorId: number | undefined,
  rating: number,
  title: string | null,
  body: string,
  createdAt: string | undefined
) => {
  const res = await axios.post(
    `http://localhost:8080/api/v1/appointments`,
    {
      doctorId,
      rating,
      title,
      body,
      createdAt,
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
