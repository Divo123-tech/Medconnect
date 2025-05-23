import axios from "axios";

export const createReview = async (
  token: string | null,
  doctorId: number | undefined,
  rating: number,
  title: string | null,
  body: string
) => {
  const res = await axios.post(
    `http://localhost:8080/api/v1/reviews`,
    {
      doctorId,
      rating,
      title,
      body,
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
export const updateReview = async (
  token: string | null,
  reviewId: number | undefined,
  rating?: number,
  title?: string | null,
  body?: string
) => {
  const res = await axios.patch(
    `http://localhost:8080/api/v1/reviews/${reviewId}`,
    {
      rating,
      title,
      body,
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