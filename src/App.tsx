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
  const handleSubmit = async (): Promise<void> => {

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
    <div
      className="wrapper"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        padding: '20px',
        background: 'linear-gradient(to right,rgb(0, 100, 7),rgb(0, 149, 22), rgb(163, 199, 0))', // warmer gradient
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Submit a Complaint</h2>

      <div
        className="complain-form"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          color: '#fff',
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            outline: 'none',
            fontSize: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            width: '100%',
          }}
        />
        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            outline: 'none',
            fontSize: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            width: '100%',
            minHeight: '100px',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          style={{
            backgroundColor: '#e53935',
            border: 'none',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '16px',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(229, 57, 53, 0.4)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#c62828')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#e53935')
          }
        >
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {/*  Saving is now showed */}
        {isSaving && <p style={{ color: '#fff' }}>Saving...</p>}

        {/* Errormessage is now sho */}
        <div style={{ color: 'yellow', fontWeight: 'bold' }}>{errorMessage}</div>

      </div>

      <h2 style={{ color: '#fff', marginTop: '40px' }}>Complaints List</h2>

      <div style={{ width: '100%', maxWidth: '600px' }}>
        {isLoading ? (
          <div style={{ color: '#fff' }}>Loading...</div>
        ) : complains.length ? (
          complains.map((complain) => (
            <div
              key={complain.Id}
              className="complain-item"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '12px',
                color: '#fff',
              }}
            >
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
            </div>
          ))
        ) : (
          <p style={{ color: '#fff' }}>No complaints available.</p>
        )}
      </div>
    </div>


  );
}

export default App;