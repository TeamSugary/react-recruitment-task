import React, { useState, useEffect, ChangeEvent } from 'react';

interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "https://sugarytestapi.azurewebsites.net/TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);

  const fetchComplains = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      const data: Complain[] = await response.json();
      setComplains(data);
    } catch (error) {
      showToast("Failed to load complaints.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!title || !body) {
      showToast("Title and complaint body are required.", "error");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(savePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      setTitle("");
      setBody("");
      fetchComplains();
      showToast("Complaint submitted successfully!", "success");
    } catch (e) {
      showToast("Error submitting complaint.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="wrapper">
      {toastMessage && (
        <div className={`toast ${toastType}`}>
          {toastMessage}
        </div>
      )}

      <h2 className="section-title">Submit a Complaint</h2>

      <form
        className="complain-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
        />

        <button className="submit-btn" type="submit" disabled={isSaving}>
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>

      <h2 className="section-title">Complaints List</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : complains.length ? (
        <div className="complain-grid">
          {complains.map((complain) => (
            <div key={complain.Id} className="complain-item">
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No complaints available.</p>
      )}
    </div>
  );
}

export default App;
