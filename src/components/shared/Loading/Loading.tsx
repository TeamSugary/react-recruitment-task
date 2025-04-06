import type React from "react";
import "./Loading.css";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  size = "lg", 
  color = "primary" 
}) => {
  return (
    <div 
      className="loading-container"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className={`spinner size-${size} color-${color}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;