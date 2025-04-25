import { RegisterRequest } from "@/utils/types";
import axios from "axios";

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterRequest) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/auth/register",
      {
        firstName,
        lastName,
        email,
        password,
      }
    );
    return response.data.token;
  } catch (error) {
    // Optional: check if it's an Axios error
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      // Useful for UI feedback
      throw new Error(message);
    }

    // Fallback error
    throw new Error("Something went wrong during registration.");
  }
};
