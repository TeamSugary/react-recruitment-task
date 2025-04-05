import { useState, useEffect } from "react";
import "./App.css"; // CSS ফাইল ইমপোর্ট

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch (e) {
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

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      await fetchComplains();
      setTitle("");
      setBody("");
    } catch (e) {
      setErrorMessage(e.message || "Something went wrong");
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

        <button
          className="button"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>

        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <div className="list-wrapper">
        <h2 className="list-title">Complaints List</h2>

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
  );
}

export default App;
