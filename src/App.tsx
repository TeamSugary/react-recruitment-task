import { useState, useEffect } from "react";
import "../src/App.css";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

type Complaint = {
  Id: number;
  Title: string;
  Body: string;
};

function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");

  // console.log(complains);

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
    setTitleError("");
    setBodyError("");
    setIsSuccess(false);
    setErrorMessage("");

    if (!title.trim() || !body.trim()) {
      if (!title.trim()) setTitleError("* Title can't be empty.");
      if (!body.trim()) setBodyError("* Complaint can't be empty.");
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
      // console.log(response);
      const data = await response.json();
      // console.log(data);
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
      fetchComplains();
      setTitle("");
      setBody("");
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (e) {
      // Error state not being set
      setErrorMessage("Failed to save complaint.");
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const complaintItems = document.querySelectorAll(".complain-item");
    complaintItems.forEach((item) => observer.observe(item));

    return () => {
      complaintItems.forEach((item) => observer.unobserve(item));
    };
  }, [complains]);

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <div className="complain-form">
        <input
          type="text"
          placeholder="Enter the title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={titleError ? "input-error" : ""}
        />
        {titleError && <p className="error-message">{titleError}</p>}

        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={bodyError ? "input-error" : ""}
        />
        {bodyError && <p className="error-message">{bodyError}</p>}

        <button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <div className="submit-class">
              Submitting... <span className="loading-spinner"></span>
            </div>
          ) : (
            "Submit Complaint"
          )}
        </button>
        {errorMessage && <p className="error-Message">{errorMessage}</p>}
        {isSuccess && (
          <p className="success-message">Submitted successfully!</p>
        )}

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
      </div>

      <h2>Complaints List</h2>

      {isLoading ? (
        <div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton">
              <div className="skeleton-title"></div>
              <div className="skeleton-body"></div>
            </div>
          ))}
        </div>
      ) : complains.length ? (
        complains.map((complain) => (
          <div key={complain.Id} className="complain-item scroll-animation">
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
