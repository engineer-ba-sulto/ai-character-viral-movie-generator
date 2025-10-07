import React from "react";

interface LoadingSpinnerProps {
  color?: "light" | "dark";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ color = "light" }) => {
  return (
    <div
      className={`w-5 h-5 border-2 border-t-transparent ${
        color === "light" ? "border-white" : "border-banana-dark"
      } rounded-full animate-spin`}
    ></div>
  );
};

export default LoadingSpinner;
