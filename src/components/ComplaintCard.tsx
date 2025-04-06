import { Complaint } from "../types/types";
import "../styles/ComplaintCard.css";

interface ComplaintCardProps {
  complaint: Complaint;
}

export const ComplaintCard = ({ complaint }: ComplaintCardProps) => {
  return (
    <div className="complaint-card">
      <h3>{complaint.Title}</h3>
      <p>{complaint.Body}</p>
      <div className="complaint-footer">
        <span className="complaint-id">ID: {complaint.Id}</span>
      </div>
    </div>
  );
};
