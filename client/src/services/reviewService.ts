import axios from "axios";

export const createReview = async (
  token: string | null,
  doctorId: number | undefined,
  rating: number,
  title: string | null,
  body: string
) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BACKENDURL}
/api/v1/reviews`,
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
    `${import.meta.env.VITE_BACKENDURL}
/api/v1/reviews/${reviewId}`,
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

export const deleteReview = async (
  token: string | null,
  reviewId: number | undefined
) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_BACKENDURL}
/api/v1/reviews/${reviewId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};