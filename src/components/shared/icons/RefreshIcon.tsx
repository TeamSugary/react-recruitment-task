import type React from "react";
import "./icons.css"; // Create this CSS file

const RefreshIcon: React.FC = () => {
  return (
    <div className="refresh-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="refresh-svg"
      >
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 1 1-2.636-6.364M21 4v4h-4"
        />
      </svg>
    </div>
  );
};

export default RefreshIcon;