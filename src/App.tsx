import { useState, useEffect } from 'react';
import './App.css'
const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

//i create two interface to strict the type for complains state and the data we get in response
interface Complain{
  Id:number;
  Title:string,
  Body:string;
}

interface SaveResponse {
  Success: boolean;
  Message?: string;
}


function App() {
  //set all the type for all state
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

// Fetch complaints from the API
const fetchComplains = async (isMounted: boolean = true): Promise<void> => {
  setIsLoading(true);
  try {
    const response = await fetch(`${baseUrl}${listPath}`);
    const data: Complain[] = await response.json();
    if (isMounted) setComplains(data);
  } catch (error) {
    if (isMounted) setErrorMessage("Failed to fetch complaints.");
  } finally {
    if (isMounted) setIsLoading(false);
  }
};

// Prevent memory leak in useEffect by handling async cleanup
  useEffect(() => {
    let isMounted = true; // Flag to prevent state update if unmounted
  
    fetchComplains(isMounted); // Call the defined fetchComplains function
  
    return () => {
      isMounted = false;  // Cleanup on component unmount
    };
  }, []);

  // Save a new complaint
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
  
    // Validate title and body fields before submission
    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }
    if (!body.trim()) {
      setErrorMessage("Complaint body is required.");
      return;
    }


    try {
      setIsSaving(true);
      setErrorMessage("");
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
       
      // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    // Try to parse the JSON response
    let data: SaveResponse;
    try {
      const text = await response.text();
      console.log(text);
      data = text ? JSON.parse(text) : { Success: false, Message: "No response data" };
    } catch (error) {
      throw new Error("Failed to parse JSON from the response.");
    }

    // Check if the response data indicates success
    if (!data.Success) {
      throw new Error(data.Message || "Failed to save complaint.");
    }

    // Clear form and update the complaint list
    setTitle("");
    setBody("");
    await fetchComplains();
    } catch (e) {
      // Set the error complain list
      setIsLoading(false);
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage("Something went wrong");
      }

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <form className="complain-form" onSubmit={handleSubmit}>
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

        <button type='submit'>
        Submit Complaint
        </button>

        {/* Place text loader when saving */}
        {isSaving ? <p style={{marginLeft:'10px', fontSize:"20px"}}>Saving... </p>: ''}
        {/* Error message not displayed even though state exists */}
        {errorMessage && (<p style={{color:'red',marginTop:'10px', fontSize:'18px'}}>
          {errorMessage}
        </p>)}
       
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