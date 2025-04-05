import { useState, useEffect } from 'react';
import "./App.css"




// 
interface Complain {
  Id: number;
  Title: string;
  Body: string;
}


// 
const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {

  // 
  const [complains, setComplains] = useState<Complain[]>([]);
   const [title, setTitle] = useState<string>("");
   const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    try{
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    }catch(e){
        console.error("Error fetching complains:", e);
        setErrorMessage("Failed to fetch complaints.")
    }
    finally{
      setIsLoading(false);
    }
   
  };

  // Save a new complaint
  const handleSubmit = async () => {
    // default error state
    setErrorMessage("");
    //input validation
    if(title.length < 4) return setErrorMessage("Title must be at least 4 characters.")
    if(body.length < 20) return setErrorMessage("Description must be at least 20 characters.");
    // start saving state
    setIsSaving(true);
    // 
    try {
      // api req
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
        }),
      });
      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
      await fetchComplains();
      setTitle("");
      setBody("")
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to save complaint. Please try again.")
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup


  // 
  return (
    <div className="wrapper">
      <h2 className='head-title'>Submit a Complaint</h2>
      {/* complain form  */}
      <div className="complain-form">
        <input
          required
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows={6}
          required
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
         {/* submit button */}
        <button onClick={handleSubmit}>
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>

        {/* Place text loader when saving */}
        {isSaving && <p style={{ color: '#000', textAlign:'left' }}>Saving...</p>}
        {/* Error message not displayed even though state exists */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
       
       {/* all complains list */}
      <h2 className='complain-header'>Complaints List</h2>
       {/*  */}
      {isLoading ? (
        <div style={{color:"#000", fontSize:"2.5rem", padding:"4rem 0rem"}}>Loading...</div>
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