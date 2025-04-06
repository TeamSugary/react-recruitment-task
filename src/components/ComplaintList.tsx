import { useState } from "react";
import { ComplaintCard } from "./ComplaintCard";
import { Complaint } from "../types/types";
import { LoadingSpinner } from "./LoadingSpinner";
import { Notification } from "./Notification";
import "../styles/ComplaintsList.css";

interface ComplaintsListProps {
  complaints: Complaint[];
  isLoading: boolean;
  errorMessage: string;
  onRetry: () => void;
}

export const ComplaintsList = ({
  complaints,
  isLoading,
  errorMessage,
  onRetry,
}: ComplaintsListProps) => {
  const [dismissedError, setDismissedError] = useState(false);

  const handleDismissError = () => {
    setDismissedError(true);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Loading complaints...</p>
      </div>
    );
  }

  if (errorMessage && !dismissedError) {
    return (
      <div className="error-container">
        <Notification
          type="error"
          message={errorMessage}
          onDismiss={handleDismissError}
        />
        <button className="retry-button" onClick={onRetry}>
          Retry Loading
        </button>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="empty-state">
        <p>No complaints available. Be the first to submit!</p>
      </div>
    );
  }

  return (
    <div className="complaints-grid">
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint.Id} complaint={complaint} />
      ))}
    </div>
  );
};
