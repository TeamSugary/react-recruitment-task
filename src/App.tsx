import { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import raw CSS

interface Complaint {
  Id: string;
  Title: string;
  Body: string;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

const TITLE_MAX_LENGTH = 50;
const BODY_MAX_LENGTH = 500;

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<string>("");
  const [bodyError, setBodyError] = useState<string>("");
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  const isFormValid = title.trim().length > 0 && body.trim().length > 0;

  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) throw new Error("Failed to fetch complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load complaints", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    }
    if (!body.trim()) {
      setBodyError("Description is required");
      isValid = false;
    }
    return isValid;
  };

  const handleTitleFocus = () => {
    if (!title.trim()) {
      setTitleError("Title is required");
    }
  };

  const handleBodyFocus = () => {
    if (!body.trim()) {
      setBodyError("Description is required");
    }
  };

  const handleBlur = (field: 'title' | 'body') => {
    if (field === 'title' && !title.trim()) {
      setTitleError("Title is required");
    } else if (field === 'body' && !body.trim()) {
      setBodyError("Description is required");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= TITLE_MAX_LENGTH) {
      setTitle(value);
      if (value.trim()) setTitleError("");
    } else {
      setTitleError(`Title cannot exceed ${TITLE_MAX_LENGTH} characters`);
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= BODY_MAX_LENGTH) {
      setBody(value);
      if (value.trim()) setBodyError("");
    } else {
      setBodyError(`Description cannot exceed ${BODY_MAX_LENGTH} characters`);
    }
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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

      if (!response.ok) throw new Error("Failed to save complaint");
      const data = await response.json();
      if (!data.Success) throw new Error("Server rejected the complaint");

      setTitle("");
      setBody("");
      setTitleError("");
      setBodyError("");
      await fetchComplaints();
      
      toast.success("Complaint submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while submitting", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    return () => {};
  }, [fetchComplaints]);

  return (
    <div className="app">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <header className="header">
        <div className="container">
          <h1 className="header-title">Complaint Management System</h1>
          <p className="header-subtitle">Submit and review complaints efficiently</p>
        </div>
      </header>

      <main className="main">
        <section className="form-section">
          <h2 className="section-title">Submit a Complaint</h2>
          
          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="form-group">
              <label htmlFor="title" className="label">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter complaint title"
                value={title}
                onChange={handleTitleChange}
                onFocus={handleTitleFocus}
                onBlur={() => handleBlur('title')}
                disabled={isSaving}
                maxLength={TITLE_MAX_LENGTH}
                aria-label="Complaint title"
                className={`input ${titleError ? 'input-error' : ''}`}
              />
              <div className="form-feedback">
                <span className="error">{titleError}</span>
                <span className="char-count">{title.length}/{TITLE_MAX_LENGTH}</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="body" className="label">Description</label>
              <textarea
                id="body"
                placeholder="Describe your complaint in detail"
                value={body}
                onChange={handleBodyChange}
                onFocus={handleBodyFocus}
                onBlur={() => handleBlur('body')}
                disabled={isSaving}
                maxLength={BODY_MAX_LENGTH}
                aria-label="Complaint description"
                rows={5}
                className={`textarea ${bodyError ? 'input-error' : ''}`}
              />
              <div className="form-feedback">
                <span className="error">{bodyError}</span>
                <span className="char-count">{body.length}/{BODY_MAX_LENGTH}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSaving || !isFormValid}
              className={`submit-button ${isSaving || !isFormValid ? 'disabled' : ''}`}
              aria-busy={isSaving}
            >
              {isSaving ? (
                <span className="loading">
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </form>
        </section>

        <section className="complaints-section">
          <h2 className="section-title">Complaints List</h2>
          
          {isLoading ? (
            <div className="loading-state" aria-live="polite">
              <svg className="spinner large" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Loading complaints...</p>
            </div>
          ) : complaints.length > 0 ? (
            <div className="complaints-grid">
              {complaints.map((complaint) => (
                <article key={complaint.Id} className="complaint-card">
                  <h3 className="card-title">{complaint.Title}</h3>
                  <p className={`card-body ${expandedCards[complaint.Id] ? '' : 'collapsed'}`}>
                    {complaint.Body}
                  </p>
                  {complaint.Body.length > 100 && (
                    <button
                      onClick={() => toggleCardExpansion(complaint.Id)}
                      className="read-more"
                    >
                      {expandedCards[complaint.Id] ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No complaints available yet.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Complaint Management System</p>
        </div>
      </footer>
    </div>
  );
}

export default App;