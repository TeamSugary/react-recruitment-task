import { useState, useEffect, useCallback } from "react";
import "./App.css";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
}
interface ComplaintResponse {
  Success: boolean;
}
function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 // Fetch complaints from the API
  const fetchComplains = useCallback(async ():Promise<void>  => {
    setIsLoading(true);
    try {
      const response  = await fetch(`${baseUrl}${listPath}`);
      const data: ComplaintResponse  = await response.json();
      setComplains(data);
    } catch (err) {
      setErrorMessage("Failed to load complaints.");
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Save a new complaint
  const handleSubmit = async (e: React.FormEvent):Promise<void>  => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please fill required fields");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data :ComplaintResponse  = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      setTitle("");
      setBody("");
      await fetchComplains(); // update list
    } catch (e) {
      setErrorMessage(e.message || "Please try again!");
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}${listPath}`);
        const data = await response.json();
        if (isMounted) setComplains(data);
      } catch (err) {
        if (isMounted) setErrorMessage("Failed to load complaints.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <div className="complain-form">
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

        <button onClick={handleSubmit}>
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>

        {isSaving && (
          <div className="loader-wrap">
            <>
              <div className="loader-circle"></div>{" "}
              <p className="loader">Submitting your complaint...</p>
            </>
          </div>
        )}

        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <h2>Complaints List</h2>

      {isLoading && (
        <div className="loader-wrap">
          <>
            <div className="loader-circle"></div>{" "}
            <p className="loader">Loading complaints...</p>
          </>
        </div>
      )}
      {!isLoading && complains.length > 0 && (
        <div className="complain-list">
          {complains
            ?.filter((item) => (item.Body && item.Title) !== "" || null)
            .map((complain: Complaint) => (
              <div key={complain.Id} className="complain-item">
                <h3>{complain?.Title}</h3>
                <p>{complain?.Body}</p>
              </div>
            ))}
        </div>
      )}

      {!isLoading && complains.length === 0 && (
        <p>No complaints available...</p>
      )}
    </div>
  );
}

export default App;
