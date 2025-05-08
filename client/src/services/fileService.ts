import axios from "axios";

export const uploadMedicalDocument = async (
  token: string | null,
  formData: FormData
) => {
  console.log(token);

  const res = await axios.post(
    "http://localhost:8080/api/v1/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
