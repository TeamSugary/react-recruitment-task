import React from "react";
import { ComplaintsListProps } from "../types";

const ComplaintsList: React.FC<ComplaintsListProps> = ({
  complaints,
  isLoading,
  fetchError,
}) => {
  // Show error message if fetch failed
  if (fetchError) {
    return (
      <div className="error-banner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="error-icon"
        >
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
          />
        </svg>
        {fetchError}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading complaints...</p>
      </div>
    );
  }

  if (!complaints.length) {
    return (
      <div className="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          className="empty-icon"
        >
          <path
            fill="currentColor"
            d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
          />
        </svg>
        <p>No complaints available yet.</p>
        <p className="empty-subtitle">Be the first to submit feedback!</p>
      </div>
    );
  }

  return (
    <div className="complaints-list">
      {complaints.map((complaint) => (
        <div key={complaint.Id} className="complaint-card">
          <h3>{complaint.Title}</h3>
          <p>{complaint.Body}</p>
          <div className="complaint-footer">
            <span className="complaint-id">ID: {complaint.Id}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintsList;
