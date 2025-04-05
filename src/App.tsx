import { useState, useEffect } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

type Complaint = {
  Id: number;
  Title: string;
  Body: string;
};

const API_BASE_URL = "https://sugarytestapi.azurewebsites.net";
const LIST_ENDPOINT = `${API_BASE_URL}/TestApi/GetComplains`;
const SAVE_ENDPOINT = `${API_BASE_URL}/TestApi/SaveComplain`;

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch complaints
  const fetchComplaints = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(LIST_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch complaints.");
      const data = await response.json();
      setComplaints(data);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(SAVE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");
      setTitle("");
      setBody("");
      await fetchComplaints();
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Initial load
  useEffect(() => {
    const controller = new AbortController();
    fetchComplaints();
    return () => controller.abort();
  }, []);

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <form className="complain-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Complaint Title"
          required
        />

        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          aria-label="Complaint Body"
          required
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>

      <h2>Complaints List</h2>

      {isLoading ? (
        <p>Loading complaints...</p>
      ) : complaints.length > 0 ? (
        complaints.map((complaint) => (
          <div key={complaint.Id || uuidv4()} className="complain-item">
            <h3>{complaint.Title}</h3>
            <p>{complaint.Body}</p>
          </div>
        ))
      ) : (
        <p>No complaints available.</p>
      )}
    </div>
  );
}

export default App;
