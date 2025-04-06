import { useState, useEffect } from "react";
import { ComplaintForm } from "./components/ComplaintForm";
import { ComplaintsList } from "./components/ComplaintList";
import { apiService } from "./services/ApiServer";
import { Complaint } from "./types/types";
import "./styles/App.css";

const App = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await apiService.getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setErrorMessage("Failed to load complaints. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintSubmitted = () => {
    fetchComplaints();
  };

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (isActive) {
        await fetchComplaints();
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="app-container">
      <section className="form-section">
        <h2>Submit a Complaint</h2>
        <ComplaintForm onComplaintSubmitted={handleComplaintSubmitted} />
      </section>

      <section className="complaints-section">
        <h2>Complaints List</h2>
        <ComplaintsList
          complaints={complaints}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onRetry={fetchComplaints}
        />
      </section>
    </div>
  );
};

export default App;
