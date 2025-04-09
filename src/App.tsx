import { useState, useEffect } from 'react';
import "./App.css";


type Complaint = {
  Id: number;
  Title: string;
  Body: string;
};


function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

  // Fetch complaints from the API

  const fetchComplains = async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    setIsLoading(false);
  };


  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup

  // Save a new complaint

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please fill in both the title and complaint.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to submit complaint.");

      await fetchComplains(); // Refresh list
      setTitle("");
      setBody("");
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

 

  return (
    <div className="app-container">
      <h1 className="title">Complaint Submission</h1>

      <div className="complain-form">
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Submit Complaint"}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <div className="complain-list">
        <h2>Submitted Complaints</h2>

        {isLoading ? (
          <p>Loading complaints...</p>
        ) : complains.length > 0 ? (
          complains.map((complain) => (
            <div className="complain-item" key={complain.Id}>
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
            </div>
          ))
        ) : (
          <p>No complaints found.</p>
        )}
      </div>
    </div>
  );
}

export default App;