import './App.css';
import { useState, useEffect } from 'react';

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";

/// set proper api
const savePath = "https://sugarytestapi.azurewebsites.net/TestApi/SaveComplain";


// Define complaint type
interface Complaint {
  Id: number;
  Title: string;
  Body: string;
}


function App() {
  const [complains, setComplains] = useState<Complaint>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch complaints from the API
  const fetchComplains = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setComplains(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      setErrorMessage("Failed to load complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new complaint
  const handleSubmit = async ()  :  Promise<void>  => {

    // title and body must required
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Title and body are required.");
      return;
    }



    try {
      setIsSaving(true);
      // Set error is empty
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
      // Missing is Fixed: Update complaints list after successful submission
      await fetchComplains();
      setTitle('');
      setBody('');
    } catch (e) {
      // set error in state
      console.error("Error submitting complaint:", e);
      setErrorMessage("Something went wrong while saving your complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup

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
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
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