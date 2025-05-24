import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [checkmarkAnimationComplete, setCheckmarkAnimationComplete] =
    useState(false);

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const successTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.7,
        duration: 0.5,
      },
    },
  };
  const circleVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: [0, 1.2, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.6, 1],
        type: "tween",
        ease: "easeOut",
      },
    },
  };
  useEffect(() => {
    (async () => {
      const token = searchParams.get("token") || "";
      if (token) {
        setToken(token);
        // Navigate to dashboard after the checkmark animation completes
        if (checkmarkAnimationComplete) {
          const timer = setTimeout(() => {
            navigate("/dashboard");
          }, 1000); // Wait 1 second after animation completes before navigating

          return () => clearTimeout(timer);
        }
      } else {
        navigate("/login");
      }
    })();
  }, [checkmarkAnimationComplete, navigate, searchParams, setToken, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl py-6 px-24 border border-gray-200">
        <motion.div className="flex flex-col items-center justify-center py-10">
          <motion.div
            className="relative w-24 h-24"
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => setCheckmarkAnimationComplete(true)}
          >
            {/* Circle background */}
            <motion.div
              variants={circleVariants}
              className="absolute inset-0 bg-green-100 rounded-full"
            />

            {/* Checkmark SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M28 50L45 67L72 33"
                stroke="#10B981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkVariants}
              />
            </svg>
          </motion.div>

          <motion.div
            variants={successTextVariants}
            initial="hidden"
            animate="visible"
            className="text-center mt-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Login Successful!
            </h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;
