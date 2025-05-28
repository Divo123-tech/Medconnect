import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getMyProfile } from "@/services/myProfileService";
import { JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
  checkDoctor?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  checkDoctor = false,
}) => {
  const { token, setUser, setToken } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        const user = await getMyProfile(token);
        setUser(user);
        setIsValid(true);
        if (checkDoctor) {
          if (user.role == "DOCTOR") {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        setToken(null);
        setUser(null);
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, setUser, setToken, checkDoctor]);

  if (isVerifying) return null; // Or a loading spinner

  if (!isValid) return <Navigate to="/login" />;

  return element;
};

export default ProtectedRoute;
