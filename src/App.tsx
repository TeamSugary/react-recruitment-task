import { useState, useEffect, FormEvent } from 'react';
import './App.css';

interface Complaint {
  Id: string;
  Title: string;
  Body: string;
}

interface ApiResponse {
  Success: boolean;
  Message?: string;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchComplains();
  }, []);

  async function fetchComplains() {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        setErrorMessage("Something went wrong while fetching complaints.");
      }
    } catch (err) {
      setErrorMessage("Error fetching data.");
      console.log("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const isEmpty = (value: string) => value.trim().length === 0;

    if (isEmpty(title) || isEmpty(body)) {
      setErrorMessage("Please enter both title and complaint.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const newComplaint = {
      Title: title,
      Body: body,
    };

    try {
      const response = await fetch(baseUrl + savePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComplaint),
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        if (result.Success) {
          setTitle("");
          setBody("");
          fetchComplains();
        } else {
          setErrorMessage(result.Message || "Failed to save complaint.");
        }
      } else {
        setErrorMessage("Error saving complaint.");
        alert("Error saving complaint. Please Try again!")
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Submission error.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="app-container">
      <div className="gradient-background">
        <div className="content-wrapper">
          <h2 className="section-title">Submit a Complaint</h2>
          <div className="form-container">
            <form className="complaint-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                disabled={isSaving}
              />
              <textarea
                placeholder="Enter your complaint"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="form-textarea"
                disabled={isSaving}
                rows={4}
              />
              <button className="submit-button" type="submit" disabled={isSaving}>
                {isSaving ? "Submitting..." : "Submit Complaint"}
              </button>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
          </div>

          <h2 className="section-title">Complaints List</h2>
          <div className="complaints-container">
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : complaints.length > 0 ? (
              <div className="complaints-list">
                {complaints.map((item) => (
                  <div key={item.Id} className="complaint-card">
                    <h3 className="complaint-title">{item.Title}</h3>
                    <p className="complaint-body">{item.Body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-complaints">No complaints available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;