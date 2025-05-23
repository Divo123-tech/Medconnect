import { BloodType } from "./types";

export const bloodTypesMap: Record<BloodType, string> = {
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
  O_POS: "O+",
  O_NEG: "O-",
};
// Calculate BMI
export const calculateBMI = (height: number, weight: number) => {
  // Height in meters (convert from cm)
  const heightInMeters = height / 100;
  // BMI formula: weight (kg) / (height (m))^2
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

// Get BMI category
export const getBMICategory = (bmi: number) => {
  if (bmi < 18.5)
    return {
      category: "Underweight",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    };
  if (bmi < 25)
    return {
      category: "Normal weight",
      color: "text-green-600 bg-green-50 border-green-200",
    };
  if (bmi < 30)
    return {
      category: "Overweight",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    };
  return {
    category: "Obese",
    color: "text-red-600 bg-red-50 border-red-200",
  };
};
