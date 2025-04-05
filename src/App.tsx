import { useState, useEffect, FormEvent } from 'react';
import Complaint from "../src/components/Complaint"
import './App.css'
import ErrorBoundary from './components/ErrorBoundary';

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";


interface Complain {
  Title: string;
  Body: string;
  Id: number;
}


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
    } catch (error: any) {

      console.log(error.message)
    } finally {

      setIsLoading(false);
    }
  };

  // Save a new complaint
  const handleSubmit = async (event: FormEvent) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    setErrorMessage("")
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
    } catch (error: any) {
      // Error state not being set
      console.log(error.message)
      setErrorMessage(error.message || "An unexpected error occurred.");

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
            minLength={3}
            maxLength={20}
            required
          />
        </label>
        <label htmlFor="body">
          <textarea
            placeholder="Enter your complaint"
            id="body" name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            minLength={6}
            maxLength={200}
            required
          />
        </label>
        <button type='submit'>
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
        <p className='error-message'>{errorMessage && errorMessage}</p>
      </form>

      <h2>Complaints List</h2>


      <ErrorBoundary>
        {isLoading ? (
          <div>Loading...</div>
        ) : complains.length ? (
          complains.map((complain: Complain) => (
            <Complaint key={complain.Id} complaintData={complain} />
          ))
        ) : (
          <p>No complaints available.</p>
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;