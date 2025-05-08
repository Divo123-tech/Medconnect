import axios from "axios";

export const getMyProfile = async (token: string | null) => {
  console.log(token);
  const res = await axios.get("http://localhost:8080/api/v1/my-profile", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res.data);
  return res.data;
};

export const updateMyProfile = async (
  token: string | null,
  formData: FormData
) => {
  console.log(token);

  const res = await axios.patch(
    "http://localhost:8080/api/v1/my-profile",
    formData,
    {
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
