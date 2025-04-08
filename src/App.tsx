import { useState, useEffect } from 'react';
import './App.css';

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

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    setIsLoading(false);
  };

  // Save a new complaint
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      if (!title.trim() || !body.trim()) {
        throw new Error('Please fill in all fields');
      }

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

      const data = await response.json();

      if (!data.Success) {
        throw new Error(data.Message || "Failed to save complaint");
      }

      // Clear form inputs
      setTitle("");
      setBody("");
      fetchComplains();

    } catch (error) {
      setErrorMessage(error.message);  // Set error state
    } finally {
      setIsSaving(false);
    }
  };


  useEffect(() => {
    fetchComplains();
  }, [])

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

        <button onClick={handleSubmit}>
          Submit Complaint
        </button>

        {/* Place text loader when saving */}
        {isSaving && (
          <div className="saving-indicator">
            Saving...
          </div>
        )}

        {/* Error message not displayed even though state exists */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      <h2>Complaints List</h2>

      {isLoading ? (
        <div>Loading...</div>
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