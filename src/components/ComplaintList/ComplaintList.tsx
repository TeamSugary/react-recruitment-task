import React from "react";
import { ExtendedComplaintListProps } from "../../types/types";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ComplaintList: React.FC<ExtendedComplaintListProps> = ({
  complaints,
  isLoading,
  error,
  onRefresh,
}) => {
  return (
    <div
      className="list-card"
      style={{ height: "500px", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          gap: "20px",
        }}
      >
        <h2 className="section-title">Complaints List</h2>
        <button
          onClick={onRefresh}
          className="refresh-button"
          disabled={isLoading}
          style={{
            padding: "5px 10px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          Refresh
        </button>
      </div>

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
        <div
          className="complaints-list"
          aria-label="List of complaints"
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "0 10px",
          }}
        >
          {complaints.map((complaint) => (
            <div key={complaint.Id} className="complaint-item">
              <h3 className="complaint-title">
                {complaint.Title}
                <span
                  style={{
                    fontSize: "0.8em",
                    color: "#666",
                    marginLeft: "10px",
                  }}
                >
                  (ID: {complaint.Id})
                </span>
              </h3>
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
        <div className="empty-state" role="status" style={{ flex: 1 }}>
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
