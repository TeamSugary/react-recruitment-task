import type React from "react";
import "./Loading.css";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  size = "md", 
  color = "primary" 
}) => {
  return (
    <div 
      className="loading-container"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className={`loading-icon size-${size} color-${color}`}>
        <svg 
          className="animated-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M21 11.5C21.8284 11.5 22.5 12.1716 22.5 13C22.5 19.3513 17.3513 24.5 11 24.5C4.64873 24.5 -0.5 19.3513 -0.5 13C-0.5 6.64873 4.64873 1.5 11 1.5C11.8284 1.5 12.5 2.17157 12.5 3C12.5 3.82843 11.8284 4.5 11 4.5C6.30558 4.5 2.5 8.30558 2.5 13C2.5 17.6944 6.30558 21.5 11 21.5C15.6944 21.5 19.5 17.6944 19.5 13C19.5 12.1716 20.1716 11.5 21 11.5Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;