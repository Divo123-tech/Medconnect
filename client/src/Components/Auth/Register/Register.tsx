import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Stethoscope,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
              <div className="flex justify-center mb-3">
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
                className="text-center mb-6"
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Create your account
                </h1>
                <p className="text-gray-600">
                  Join us to book appointments with top doctors
                </p>
              </motion.div>
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-around gap-2">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      required
                      className="h-12 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      required
                      className="h-12 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="h-12 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordsMatch(
                          e.target.value === password || e.target.value === ""
                        );
                      }}
                      className={`h-12 border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all pr-10 ${
                        !passwordsMatch
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {!passwordsMatch && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-red-500 text-sm"
                    >
                      Passwords do not match
                    </motion.p>
                  )}
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
                        Creating account...
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Create Account <ArrowRight className="ml-2" size={18} />
                      </span>
                    )}
                  </Button>
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-center text-gray-600 text-sm"
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Sign in
                  </Link>
                </motion.p>
              </motion.form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6"
              >
                <CheckCircle2 size={64} />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully.
              </p>
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white text-lg py-2 px-4 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Continue to Login
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
