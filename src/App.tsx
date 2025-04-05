import { useState, useEffect } from "react";
import "./App.css";

// API URLs
const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

// Complaint টাইপ ডিফাইন করছি
interface Complaint {
  Id: number;
  Title: string;
  Body: string;
}

// API Response টাইপ (Save করার response)
interface SaveResponse {
  Success: boolean;
  Message?: string;
}

function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data: Complaint[] = await response.json();
      setComplains(data);
    } catch {
      setErrorMessage("Failed to fetch complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: title,
          Body: body,
        }),
      });

      const data: SaveResponse = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      await fetchComplains();
      setTitle("");
      setBody("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="container">
      <div className="form-wrapper">
        <h2 className="form-title">Submit a Complaint</h2>

        <input
          type="text"
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="textarea"
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button className="button" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <div className="list-wrapper">
        <h2 className="list-title">Complaints List</h2>

        <div className="complain-list">
          {isLoading ? (
            <p className="loading">Loading...</p>
          ) : complains.length ? (
            complains.map((complain) => (
              <div key={complain.Id} className="complain-card">
                <h3>{complain.Title}</h3>
                <p>{complain.Body}</p>
              </div>
            ))
          ) : (
            <p className="no-complain">No complaints available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
