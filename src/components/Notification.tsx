import { useState, useEffect } from "react";
import "../styles/Notification.css";

export type NotificationType = "success" | "error";

interface NotificationProps {
  type: NotificationType;
  message: string;
  onDismiss: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
}

export const Notification = ({
  type,
  message,
  onDismiss,
  autoDismiss = true,
  dismissTime = 10000,
}: NotificationProps) => {
  const [dismissProgress, setDismissProgress] = useState<number>(100);

  useEffect(() => {
    if (autoDismiss && message) {
      // Start countdown animation
      const startTime = Date.now();
      const endTime = startTime + dismissTime;

      const updateProgress = () => {
        const currentTime = Date.now();
        const remaining = Math.max(0, endTime - currentTime);
        const percentage = (remaining / dismissTime) * 100;

        setDismissProgress(percentage);

        if (percentage > 0) {
          requestAnimationFrame(updateProgress);
        } else {
          onDismiss();
        }
      };

      const animationFrame = requestAnimationFrame(updateProgress);

      // Set timeout as a backup
      const timeoutId = setTimeout(() => {
        onDismiss();
      }, dismissTime);

      return () => {
        cancelAnimationFrame(animationFrame);
        clearTimeout(timeoutId);
      };
    }
  }, [autoDismiss, dismissTime, message, onDismiss]);

  if (!message) {
    return null;
  }

  const className = type === "success" ? "success-message" : "error-message";
  const role = type === "success" ? "status" : "alert";

  return (
    <div className={`notification ${className}`} role={role}>
      <div className="notification-content">
        <span>{message}</span>
        <button
          type="button"
          className="dismiss-button"
          onClick={onDismiss}
          aria-label={`Dismiss ${type} message`}
        >
          ✕
        </button>
      </div>
      {autoDismiss && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${dismissProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
