import { useState, useEffect } from "react";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchComplains = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) throw new Error("Failed to fetch complaints.");
      const data = await response.json();
      setComplains(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error loading complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!title.trim() || !body.trim()) {
        setErrorMessage("Please fill in both fields.");
        return;
      }

      if (title.length > 50) {
        setErrorMessage("Title must be less than 50 characters.");
        return;
      }

      if (body.length > 500) {
        setErrorMessage("Complaint must be less than 500 characters.");
        return;
      }

      setErrorMessage("");
      setIsSaving(true);
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      setTitle("");
      setBody("");
      setSuccessMessage("Complaint submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchComplains();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error saving complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="main-container">
      <div className="form-container">
        {/* Form Section */}
        <h2>Submit a Complaint</h2>
        <form onSubmit={handleSubmit} className="complain-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
          />
          <textarea
            placeholder="Enter your complaint"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={500}
            required
            rows={5}
          />
          <button type="submit" disabled={isSaving}>
            {isSaving ? "Submitting..." : "Submit Complaint"}
          </button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>

      {/* Complaint List Heading */}
      <div className="complaints-list-heading">
        <h3>Complaint List</h3>
      </div>

      {/* Complaints List - With background for each complaint */}
      <div className="complaints-list">
        {isLoading ? (
          <p>Loading complaints...</p>
        ) : complains.length ? (
          complains.map((complain) => (
            <div key={complain.Id} className="complaint-box">
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
            </div>
          ))
        ) : (
          <p>No complaints available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
