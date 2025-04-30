import axios from "axios";

export const getPatient = async (
  token: string | null,
  id: string | undefined
) => {
  const res = await axios.get(`http://localhost:8080/api/v1/patients/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
