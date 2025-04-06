import { useState, useEffect } from "react";
import "./App.css";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

const SkeletonLoading = () => {
  return (
    <div className="skeleton-wrapper">
      {[1, 2, 3].map((item) => (
        <div key={item} className="skeleton-item">
          <div className="skeleton-title"></div>
          <div className="skeleton-body"></div>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
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
    if (!/\S/.test(title) || !/\S/.test(body)) {
      setErrorMessage("Please fill in both fields.");
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
      // console.log(data)

      if (!data.Success) throw new Error("Failed to save complaint.");

      await fetchComplains();
    } catch (e) {
      setErrorMessage((e as Error).message);
    } finally {
      setIsSaving(false);
      setTitle("");
      setBody("");
      setErrorMessage("");
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <form
        className="complain-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="input-group">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              placeholder="Enter complaint title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
              aria-required="true"
              aria-invalid={errorMessage ? "true" : "false"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Description:</label>
            <textarea
              id="body"
              typeof="text"
              placeholder="Enter your complaint details"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isSaving}
              aria-required="true"
              aria-invalid={errorMessage ? "true" : "false"}
            />
          </div>
        </div>

        <button type="submit" disabled={isSaving} aria-busy={isSaving}>
          {isSaving ? (
            <span className="loading-text">
              <span className="loading-spinner"></span>
              Submitting...
            </span>
          ) : (
            "Submit Complaint"
          )}
        </button>

        {errorMessage && (
          <div className="error" role="alert">
            {errorMessage}
          </div>
        )}
      </form>

      <h2>Complaints List</h2>

      {isLoading ? (
        <SkeletonLoading />
      ) : complains.length ? (
        <div className="complains-list">
          {complains.map((complain) => (
            <article key={complain.Id} className="complain-item">
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="no-complaints">No complaints available.</p>
      )}
    </div>
  );
}

export default App;
