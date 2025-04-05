import React, { useState } from "react";
import { Complaint } from "../../services/complaintService";

interface ComplaintListProps {
  complaints: Complaint[];
  isLoading: boolean;
}

const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  isLoading,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading complaints...</p>
      </div>
    );
  }

  const filteredComplaints = complaints.filter(
    (complaint) => complaint.Title.trim() !== "" && complaint.Body.trim() !== ""
  );

  if (filteredComplaints.length === 0) {
    return (
      <div className="empty-state">
        <p>No complaints available.</p>
      </div>
    );
  }

  return (
    <div className="complaints-list">
      {filteredComplaints.map((complaint) => (
        <div
          key={complaint.Id}
          className="complaint-card"
          onClick={() => toggleExpand(complaint.Id)}
        >
          <h3>{complaint.Title}</h3>
          <p>{complaint.Body}</p>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
