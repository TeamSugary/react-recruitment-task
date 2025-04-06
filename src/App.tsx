import { useState, useEffect } from 'react';

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt?: string;
  Status?: string;
}

const API_BASE_URL = "https://sugarytestapi.azurewebsites.net/";
const LIST_PATH = "TestApi/GetComplains";
const SAVE_PATH = "TestApi/SaveComplain";

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}${LIST_PATH}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Complaint[] = await response.json();

      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fetching failed");
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!title.trim() || !body.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(`${API_BASE_URL}${SAVE_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess("Complaint submitted successfully!");
      setTitle("");
      setBody("");

      await fetchComplaints();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="wrapper">
      <h1>Customer Complaints</h1>

      <section className="complaint-section">
        <h2>Submit a Complaint</h2>
        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Details</label>
            <textarea
              id="body"
              placeholder="Enter your complaint details"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isSaving}
              rows={5}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="primary-button" disabled={isSaving || !title.trim() || !body.trim()}>
            {isSaving ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              'Submit Complaint'
            )}
          </button>
        </form>
      </section>

      <section className="complaints-list">
        <h2>Recent Complaints</h2>

        {isLoading ? (
          <div className="loading-spinner">Loading complaints...</div>
        ) : complaints.length > 0 ? (
          <div className="complaints-grid">
            {complaints.map((complaint) => (
              <article key={complaint.Id} className="complaint-card">
                <h3>{complaint.Title}</h3>
                <p>{complaint.Body}</p>
                {complaint.CreatedAt && (
                  <time dateTime={complaint.CreatedAt}>
                    {new Date(complaint.CreatedAt).toLocaleDateString()}
                  </time>
                )}
                {complaint.Status && (
                  <span className={`status-badge ${complaint.Status?.toLowerCase()}`}>
                    {complaint.Status}
                  </span>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="no-complaints">No complaints found</p>
        )}
      </section>
    </div>
  );
}

export default App;
