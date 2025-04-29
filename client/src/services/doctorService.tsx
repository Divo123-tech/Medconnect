import { GetAllDoctorsResponse } from "@/utils/types";
import axios from "axios";

export const getDoctors = async ({
  name = "",
  specialization = "",
  sortBy = "firstName",
  page = 0,
  size = 10,
}: {
  name: string;
  specialization: string;
  sortBy: string;
  page: number;
  size: number;
}) => {
  try {
    const res = await axios.get<GetAllDoctorsResponse>(
      `http://localhost:8080/api/v1/doctors`,
      {
        params: {
          name,
          specialization,
          sortBy,
          page,
          size,
        },
      }
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to fetch doctors");
  }
};
