import { useState, useEffect } from 'react';

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

type Complain = {
  Id: number;
  Title: string;
  Body: string;
};

function App() {
  //const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [complains, setComplains] = useState<Complain[]>([]);


  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    setIsLoading(false);
  };

  // Save a new complaint
  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please fill in both title and complaint body.");
      return;
    }    
    try {
      setIsSaving(true);
      //const response = await fetch(savePath, { missing baseUrl
      const response = await fetch(`${baseUrl}${savePath}`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        /* test data
        body: JSON.stringify({
          Title: "Test Title",
          Body: "Test Body",
        }),*/
        body: JSON.stringify({
          Title: title,
          Body: body,
        }),        
      });
      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
      setTitle("");
      setBody("");
      fetchComplains(); // re-fetch updated list
      setSuccessMessage("Complaint submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      // Error state not being set
      setErrorMessage((e as Error).message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

/*  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup*/
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}${listPath}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setComplains(data);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setErrorMessage("Failed to load complaints.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const renderComplaints = () => {
    if (isLoading) return <div>Loading complaints...</div>;
    if (complains.length === 0) return <p>No complaints available.</p>;
  
    return complains.map((complain) => (
      <div key={complain.Id} className="complain-item">
        <h3>{complain.Title}</h3>
        <p>{complain.Body}</p>
      </div>
    ));
  };  
  

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <div className="complain-form">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="body">Complaint</label>
        <textarea
          id="body"
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />


        <button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
          {/*isSaving && <p>Submitting your complaint...</p>*/}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      </div>

      <h2>Complaints List</h2>
      {renderComplaints()}


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