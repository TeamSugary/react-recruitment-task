import { useState, useEffect } from "react";

import { Toaster } from "sonner";
import { Complaint, fetchComplaints } from "../services/complaintService";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintList from "./components/ComplaintList";

const Index = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div className="container">
      <ComplaintForm onComplaintSubmitted={loadComplaints} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Complaints List</h2>
        </div>
        <div className="card-content">
          <ComplaintList complaints={complaints} isLoading={isLoading} />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" closeButton={true} />
    </div>
  );
};

export default Index;
