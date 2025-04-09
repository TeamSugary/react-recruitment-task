import { useState, useEffect } from 'react';
import './App.css'


const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";


interface ComplainType{
Id: string
Title: string
Body: string
CreatedAt: string
}


function App() {
  const [complains, setComplains] = useState<ComplainType[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch complaints from the API
  useEffect(() => {
    fetchComplains()
  },[isSaving])
  const fetchComplains = async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    setIsLoading(false);
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
          Title:title,
          Body: body,
        }),
      });
      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
    } catch (e) {
      // Error state not being set
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  },[]); // Missing dependency array cleanup

  return (
    <section className="wrapper">
      <div id='formSection'>
        <h2>Submit a Complaint</h2>

          <form onSubmit={handleSubmit} className="complain-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
          />
            <textarea
              placeholder="Enter your complaint"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required 
          />

            <button  type='submit'>
              {isSaving ? 'Submitting...' : 'Submit Complaint'}
            </button>

            {/* Place text loader when saving */}
            {/* Error message not displayed even though state exists */}
          </form>
       </div>
      <div id='complainList'>

        <h2>Complaints List</h2>

        {isLoading ? (
          <div>Loading...</div>
        ) : complains.length ? (
          complains.map((complain) => (
            <div key={complain.Id} className="complain-item">
              <h3>{complain.Title}</h3>
              <p>{complain?.Body.slice(0,100)}</p>
            </div>
          ))
        ) : (
          <p>No complaints available.</p>
        )}
      </div>
    </section>
  );
}

export default App;