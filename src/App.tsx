import { useState, useEffect } from 'react';

interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "https://sugarytestapi.azurewebsites.net/TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchComplains = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      const data: Complain[] = await response.json();
      setComplains(data);
    } catch (error) {
      setErrorMessage("Failed to load complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title || !body) {
      setErrorMessage("Title and complaint body are required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const response = await fetch(savePath, {
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
      fetchComplains();
    } catch (e) {
      setErrorMessage("Error submitting complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="wrapper">
      <h2 className="section-title">Submit a Complaint</h2>

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

        <button onClick={handleSubmit} disabled={isSaving} className="submit-btn">
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <h2 className="section-title">Complaints List</h2>

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
