import { useState, useEffect, useCallback } from "react";
import "./App.css";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

type TComplain = {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
};

function App() {
  const [complains, setComplains] = useState<TComplain[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch complaints
  const fetchComplains = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch complaints.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplains();
  }, [fetchComplains]);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Title and Body are required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      // Reset form & fetch updated list
      setTitle("");
      setBody("");
      await fetchComplains();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <div className="complain-form">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="body">Complaint</label>
        <textarea
          id="body"
          placeholder="Describe your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>

        {errorMessage && <small className="error">{errorMessage}</small>}
      </div>

      <h2>Complaints List</h2>

      {isLoading ? (
        <div className="loader">Loading complaints...</div>
      ) : complains.length > 0 ? (
        <div className="complain-list">
          {complains.map((complain) => (
            <div key={complain.Id} className="complain-item">
              <div className="complain-header">
                <h3>{complain.Title}</h3>
                <small>
                  {new Date(complain.CreatedAt).toLocaleString()}
                </small>
              </div>
              <p>{complain.Body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No complaints available.</p>
      )}
    </div>
  );
}

export default App;
