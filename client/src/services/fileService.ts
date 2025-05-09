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

export const getMedicalDocuments = async (
  token: string | null,
  id: number | undefined
) => {
  console.log(token);

  const res = await axios.post(`http://localhost:8080/api/v1/documents/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res.data);
  return res.data;
};

export const deleteMedicalDocument = async (
  token: string | null,
  id: string | undefined
) => {
  console.log(token);

  const res = await axios.delete(
    `http://localhost:8080/api/v1/documents/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res.data);
  return res.data;
};
  
