import { useState, useEffect } from 'react';
import "./App.css"
import { TComplain } from './types/complain';
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
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
      setIsLoading(false);
    } catch (error: any) {
      setErrorMessage(error)
    }
  };

  // Save a new complaint
  const handleSubmit = async () => {
    try {
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
      if (!data.Success) throw new Error("Failed to save complaint.");
      setIsSaving(false);
      setBody("");
      setTitle("")
    } catch (error: any) {
      setErrorMessage(error)
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, [isSaving]);

  return (
    <div className="wrapper">
      <div className="container">
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
            {isSaving ? 'Submitting...' : 'Submit Complaint'}
          </button>



          {/* Error message */}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}error</p>}
        </div>

        <h2>Complaints List</h2>
        <div className="complaints">
          {isLoading ? (<div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
            <p>Loading...</p>
          </div>
          ) : complains.length ? (
            complains.map((complain: TComplain) => (
              <div key={complain.Id} className="complain-item">
                <h3>{complain.Title}</h3>
                <p>{complain.Body}</p>
              </div>
            ))
          ) : (
            <p>No complaints available.</p>
          )}
        </div>

      </div>

    </div>
  );
}

export default App;