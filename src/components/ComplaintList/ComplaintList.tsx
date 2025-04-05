import React from "react";
import { ComplaintListProps } from "../../types/types";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  isLoading,
  error,
}) => {
  return (
    <div className="list-card">
      <h2 className="section-title">Complaints List</h2>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container" aria-live="polite" aria-busy="true">
          <div className="spinner"></div>
          <p className="sr-only">Loading complaints...</p>
        </div>
      ) : complaints && complaints.length > 0 ? (
        <div className="complaints-list" aria-label="List of complaints">
          {complaints.map((complaint) => (
            <div key={complaint.Id} className="complaint-item">
              <h3 className="complaint-title">{complaint.Title}</h3>
              <p className="complaint-body">{complaint.Body}</p>
              {complaint.CreatedAt && (
                <p className="complaint-date">
                  Submitted on {formatDate(complaint.CreatedAt)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <p>No complaints available.</p>
          <p className="empty-state-subtext">
            Be the first to submit a complaint.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
