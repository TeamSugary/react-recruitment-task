import { useState, useEffect } from 'react';

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
  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(savePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: "Test Title",
          Body: "Test Body",
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
  }, []); // Missing dependency array cleanup

  return (
    <div className="wrapper flex-column text-center min-h-screen py-10">
      <h2 className='heading-1'>Submit a Complaint</h2>

      <div className="complain-form flex-column items-center gap-5 box">
        <input className='inner-box'
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea className='inner-box pb-7'
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button className='btn' onClick={handleSubmit}>
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
      </div>

      <h2 className='heading-1 pt-5'>Complaints List</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : complains.length ? (
        complains.map((complain) => (
          <div  key={complain.Id} className="complain-item box-1 text-left my-1.5 p-7 border-[rgba(255,255,255,.2)] border-[0.5px]">
            <h3 className='font-bold mb-3'>{complain.Title}</h3>
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