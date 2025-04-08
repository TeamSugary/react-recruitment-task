import { useState, useEffect } from "react";
import "./App.css";
import { CircleLoader, HashLoader, PuffLoader } from "react-spinners";

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
}

interface SaveComplaintResponse {
  Success: boolean;
  Message?: string;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch complaints from the API
  const fetchComplains = async (): Promise<void> => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data: Complaint[] = await response.json();
      setComplains(data);
    } catch (error) {
      setErrorMessage(
        `Failed to fetch complaints: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  console.log(complains);

  // Save a new complaint
  const handleSubmit = async (): Promise<void> => {
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please enter both title and body for your complaint");
      return;
    }

    try {
      setErrorMessage("");
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
      const data: SaveComplaintResponse = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission

      setTitle("");
      setBody("");

      fetchComplains();
    } catch (error) {
      // Error state not being set
      setErrorMessage(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup

  return (
    <div className="wrapper">
      <h2
        className="title"
        style={{
          textAlign: "left",
          width: "100%",
          marginLeft: 0,
          paddingLeft: 0,
        }}
      >
        Submit a Complaint
      </h2>

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
          rows={5}
        />

        <button onClick={handleSubmit}>
          {isSaving ? <PuffLoader /> : "Submit Complaint"}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}

        {/* display error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      <h2
        className="list-title"
        style={{
          textAlign: "left",
          width: "100%",
          marginLeft: 0,
          paddingLeft: 0,
        }}
      >
        Complaints List
      </h2>

      {isLoading ? (
        // <div>Loading...</div>
        <HashLoader />
      ) : complains.length ? (
        complains.map((complain) => (
          <div key={complain.Id} className="complain-item">
            <h3 className="complain-title">{complain.Title}</h3>
            <p className="complain-body">{complain.Body}</p>
          </div>
        ))
      ) : (
        <p>No complaints available.</p>
      )}
    </div>
  );
}

export default App;
