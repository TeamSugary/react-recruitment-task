import { useState, useEffect } from 'react';

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

type Complain = {
  Id: string;        
  Title: string;
  Body: string;
};

function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string|null>("");

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch (error) {
      setErrorMessage("Failed to load complaints.");
    } finally {
      setIsLoading(false);
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
      setTitle("");
      setBody("");
  
 
      fetchComplains();
      // Missing: Update complaints list after successful submission
    } catch (e:any) {
      setErrorMessage(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
    
  }, []); // Missing dependency array cleanup

  return (
    <div className="wrapper flex flex-col text-center min-h-screen py-10">
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
        {isSaving && <p className="mr-auto text-xl">saving..</p>}

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
      </div>

      <h2 className='heading-1 pt-5'>Complaints List</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : complains.length ? (
        complains.map((complain:Complain) => (
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