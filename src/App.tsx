import { useState, useEffect } from 'react';
import './App.css';

export interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  isExpanded?: boolean;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch complaints from the API
  const fetchComplains = async (signal?: AbortSignal) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}${listPath}`, signal ? { signal } : undefined);
      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data: Complaint[] = await response.json();
      setComplains(data);
    } catch (e: any) {
      if (e.name === "AbortError") {
        // console.log("Fetch aborted");
        return;
      }
      console.error("fetch error:", e);
      setErrorMessage("Failed to load complaints.");
    }
    finally {
      setIsLoading(false);

    }
  };

  // Save a new complaint
  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please fill in all fields."); return;
    }
    setErrorMessage("");
    setIsSaving(true);
    try {

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
      console.log(data);
      if (!data.Success) throw new Error("Failed to save complaint.");
      setTitle("");
      setBody("");
      fetchComplains();
    } catch (e) {
      console.error("submission error:", e);
      setErrorMessage("An error occurred while saving the complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchComplains(controller.signal);
    return () => {
      controller.abort();
    };

  }, []); 
  const toggleExpand = (id: number) => {
    setComplains((prev) =>
      prev.map((c) =>
        c.Id === id ? { ...c, isExpanded: !c.isExpanded } : c
      )
    );
  };
  
  return (

    <>
      <div className="wrapper">
        <h2>Submit a Complaint</h2>

        <div className="complain-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            maxLength={40}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter your complaint"
            value={body}
            required
            onChange={(e) => setBody(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {isSaving ? <>
              <span>Saving...</span>
            </> : 'Submit Complaint'}
          </button>

         
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <h2>Complaints List</h2>

        {isLoading ? (
          <div >Loading...</div>
        ) : complains.length ? (
          complains.map((complain) => {
            const isTitleLong = complain.Title.length > 40;
            const isBodyLong = complain.Body.length > 100;
            const { isExpanded } = complain;
            return (<div key={complain.Id} className="complain-item">
              <h3 className="complain-title">
                  {isExpanded || !isTitleLong ? complain.Title : `${complain.Title.slice(0, 100)}...`}
                </h3>

                <p className="complain-body" id={`complaint-${complain.Id}`}>
                  {isExpanded || !isBodyLong ? complain.Body : `${complain.Body.slice(0, 200)}...`}
                </p>

              {(isTitleLong || isBodyLong) && (
                <button
                  className="toggle-btn"
                  onClick={() => toggleExpand(complain.Id)}
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              )}
            </div>)
          })
        ) : (
          <p>No complaints available.</p>
        )}
      </div>

    </>
  );
}

export default App;