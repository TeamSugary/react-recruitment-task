import { useState, useEffect } from "react";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

interface SaveResponse {
  Success: boolean;
  Message: string;
}

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch complaints from the API
  const fetchComplains = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) throw new Error("Failed to fetch complaints.");
      const data = await response.json();
      setComplains(data);
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new complaint
  const handleSubmit = async (): Promise<void> => {
    if (!title || !body) {
      setErrorMessage("Title and Body are required.");
      return;
    }
    try {
      setErrorMessage("");
      setIsSaving(true);
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
      if (!response.ok || !data.Success) {
        throw new Error(data.Message || "Failed to save complaint.");
      }

      // Clear inputs and refresh list
      setTitle("");
      setBody("");
      fetchComplains();
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <div className="complain-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <>
              Submitting
              <span className="spinner" />
            </>
          ) : (
            "Submit Complaint"
          )}
        </button>

        {/* Fixed error message */}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <h2>Complaints List</h2>

      {isLoading ? (
        <div className="loading">
          Loading complaints <span className="spinner" />
        </div>
      ) : complains.length ? (
        complains.map((complain) => (
          <div key={complain.Id} className="complain-item">
            <h3>{complain.Title}</h3>
            <p>{complain.Body}</p>
          </div>
        ))
      ) : (
        <p>No complaints available.</p>
      )}
    </div>
  );
}

export default App;
