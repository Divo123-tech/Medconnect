import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore"; // Assuming you have a zustand store for auth state
import { JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element; // The element you want to render if authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { token } = useAuthStore(); // Get token from your auth store

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the requested element
  return element;
};

export default ProtectedRoute;
