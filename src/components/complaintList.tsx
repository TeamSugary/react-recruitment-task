import React from "react";
import { Complaint } from "../types/complaint";

interface Props {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
}

const ComplaintList: React.FC<Props> = ({ complaints, isLoading, error }) => {
  const validComplaints = complaints.filter(
    (c) => c.Title.trim() !== "" && c.Body.trim() !== ""
  );
  if (error) {
    return <div className="error">{error}</div>;
  }
  if (isLoading)
    return (
      <div className="complaint-list-skeleton">
        {[...Array(24)].map((_, index) => (
          <div key={index} className="complaint-card-skeleton"></div>
        ))}
      </div>
    );
  if (!validComplaints.length && !isLoading)
    return <p>No complaints available.</p>;

  return (
    <div className="complain-list">
      {validComplaints.map((c) => (
        <div key={c.Id} className="complain-card">
          <h3>{c.Title}</h3>
          <p>{c.Body}</p>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
