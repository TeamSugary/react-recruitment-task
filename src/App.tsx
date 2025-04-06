import { useState, useEffect, useCallback } from 'react';
const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  interface Complaint {
    _id?: string;
    title: string;
    body: string;
    createdAt?: string;
  }
  
  interface ApiResponse {
    Success: boolean;
  }
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch complaints from the API
  const fetchComplains = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      const data: Complaint[] = await response.json();
      setComplains(data);
    } catch (error) {
      setErrorMessage("Failed to load complaints.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  

// Save a new complaint
  const handleSubmit = async (): Promise<void>  => {
    if (!title || !body) {
      setErrorMessage("Please enter valid title and complaint body");
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
      interface ApiResponse {
        Success: boolean;
      }
      
      const data: ApiResponse = await response.json();
      setTitle("");
      setBody(""); 
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
      await fetchComplains();
    } catch (e) {
      setErrorMessage(e.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, [fetchComplains]); // Missing dependency array cleanup

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <div className="complain-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
           aria-label="Complaint title"
        />
        
        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setBody(e.target.value)
          }
          aria-label="Complaint body"
        />

        <button onClick={handleSubmit}>
          Submit Complaint
        </button>

        {/* Place text loader when saving */}
        {isSaving ? <p>Saving...</p> : ''}
        {/* Error message not displayed even though state exists */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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