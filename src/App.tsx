import { useState, useEffect, useCallback } from "react";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  interface Complain {
    Id: number;
    Title: string;
    Body: string;
  }
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [warn, setWarn] = useState(false);

  // Fetch complaints from the API
  const fetchComplains = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setWarn(true);
      setTimeout(() => setWarn(false), 3000);
      return;
    }
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
      console.log(data);
      setWarn(false);
      if (!data.Success) throw new Error("Failed to save complaint.");
      await fetchComplains();
      setTitle("");
      setBody("");
    } catch (e) {
      console.log(e);

      if (e instanceof Error) {
        setErrorMessage(e.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, [fetchComplains]);

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>
      {warn && (
        <p style={{ color: "red" }}>Title And Body message can not be empty</p>
      )}

      <div className="complain-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          aria-label="Complaint title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter your complaint"
          value={body}
          aria-label="Complaint details"
          onChange={(e) => setBody(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
      </div>

      <h2>Complaints List</h2>

      {isLoading ? (
        <div style={{ fontSize: "3rem", color: "#99BC85" }}>
          Loading... Please Wait
        </div>
      ) : complains.length ? (
        complains.map((complain, i) => (
          <div key={complain.Id} className="complain-item">
            <p>
              <strong>{i + 1}.</strong>
            </p>
            <div>
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No complaints available.</p>
      )}
    </div>
  );
}

export default App;
