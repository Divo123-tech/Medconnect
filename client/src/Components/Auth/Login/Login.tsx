"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { LoginRequest } from "@/utils/types";
import { login } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  // Animation states
  const [checkmarkAnimationComplete, setCheckmarkAnimationComplete] =
    useState(false);
  const { setToken } = useAuthStore();
  useEffect(() => {
    // Navigate to dashboard after the checkmark animation completes
    if (checkmarkAnimationComplete) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000); // Wait 1 second after animation completes before navigating

      return () => clearTimeout(timer);
    }
  }, [checkmarkAnimationComplete, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset any previous errors
    setFormError(null);

    setIsSubmitting(true);

    // Simulate API call
    try {
      const jwtToken = await login(loginRequest);
      console.log(jwtToken);
      setToken(jwtToken);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      setIsSubmitting(false);
      setFormError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the state dynamically based on input name
    setLoginRequest((prev) => ({
      ...prev,
      [name]: value, // Update the corresponding key in the state
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!isSuccess ? (
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600"
                >
                  <Stethoscope size={32} />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome back
                </h1>
                <p className="text-gray-600">
                  Sign in to access your appointments
                </p>
              </motion.div>
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
                  >
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formError}</span>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    name="email"
                    onChange={handleInput}
                    className="h-12 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      onChange={handleInput}
                      className="h-12 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center"
                      >
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Sign In <ArrowRight className="ml-2" size={18} />
                      </span>
                    )}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-3"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-gray-300 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 border-gray-300 hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                    </svg>
                    Apple
                  </Button>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-center text-gray-600 text-sm mt-6"
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Sign up
                  </Link>
                </motion.p>
              </motion.form>
            </div>
          ) : (
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
                <p className="text-gray-600">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
