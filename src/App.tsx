import { useState, useEffect } from "react";
import "./App.css";
import ComplaintForm from "./components/ComplaintForm/ComplaintForm";
import ComplaintList from "./components/ComplaintList/ComplaintList";
import useApiFetch from "./hooks/UseFetch";
import { Complaint } from "./types/types";

const App = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    data: complaints,
    isLoading: complaintsLoading,
    error: complaintsError,
    fetchData: fetchComplaints,
  } = useApiFetch<Complaint[]>();

  useEffect(() => {
    fetchComplaints("TestApi/GetComplains").catch((error) => {
      console.error("Failed to fetch complaints:", error);
    });
  }, [fetchComplaints, refreshTrigger]);

  const handleComplaintSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Complaint Management System</h1>
      </header>

      <div className="content-wrapper" style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <ComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
        </div>
        <div style={{ flex: 1 }}>
          <ComplaintList
            complaints={complaints}
            isLoading={complaintsLoading}
            error={complaintsError}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
