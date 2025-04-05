import { useState, useEffect, FormEvent } from 'react';
import './App.css'

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
  const handleSubmit = async (event: FormEvent) => {
    // Prevent the default form submission behavior
    event.preventDefault();

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
      // Missing: Update complaints list after successful submission
      fetchComplains();
      emptyInputs()
    } catch (e) {
      // Error state not being set
    } finally {
      setIsSaving(false);
    }
  };

  function emptyInputs() {
    setBody("")
    setTitle("")
  }

  useEffect(() => {
    fetchComplains();

    return () => {
      console.log('clean up')
    }
  }, []); // Missing dependency array cleanup

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <form className="complain-form" onSubmit={(event) => handleSubmit(event)}>
        <label htmlFor="title">
          <input
            type="text"
            placeholder="Title"
            id="title" name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label htmlFor="body">
          <textarea
            placeholder="Enter your complaint"
            id="body" name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>
        <button type='submit'>
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
      </form>

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