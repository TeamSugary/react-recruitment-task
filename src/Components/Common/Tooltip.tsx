import React from "react";
import { TooltipProps } from "../../types";

const Tooltip: React.FC<TooltipProps> = ({
  visible,
  message,
  type,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div
      className={`global-tooltip ${
        type === "error" ? "tooltip-error" : "tooltip-success"
      }`}
    >
      <div className="tooltip-content">
        {type === "error" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="tooltip-icon"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="tooltip-icon"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-10h2v6h-2z"
            />
          </svg>
        )}
        <span className="tooltip-message">{message}</span>
        <button onClick={onClose} className="tooltip-close">
          ×
        </button>
      </div>
    </div>
  );
};

export default Tooltip;
