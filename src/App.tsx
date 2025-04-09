import { useEffect, useState } from "react";
import { Complaint } from "./types/complaint";
import { getComplaints } from "./api/complaints";
import ComplaintForm from "./components/complaintForm";
import ComplaintList from "./components/complaintList";
import "./App.css";
interface APIError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await getComplaints();
      setComplaints(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as APIError;
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to load complaints.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <main className="wrapper">
      <section className="complain-form-wrapper">
        <h1>Submit a Complaint</h1>
        <ComplaintForm onSuccess={fetchComplaints} />
      </section>

      <section className="complain-list-wrapper">
        <h2>Complaints List</h2>
        <ComplaintList
          complaints={complaints}
          isLoading={isLoading}
          error={error}
        />
      </section>
    </main>
  );
}

export default App;
