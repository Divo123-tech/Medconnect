"use client";
import PhoneInputBase, { type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  defaultCountry?: Country;
  className?: string;
  inputclassname?: string;
}

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = "US",
  className,
  inputclassname,
}: PhoneInputProps) {
  return (
    <div className={cn("relative", className)}>
      <PhoneInputBase
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        value={value}
        onChange={onChange}
        className="flex"
        inputclassname={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background   file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "flex-1 min-w-0",
          inputclassname
        )}
      />
    </div>
  );
}
