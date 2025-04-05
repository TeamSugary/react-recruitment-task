import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  interface Complain {
    Id: number;
    Title: string;
    Body: string;
    CreatedAt?: string;
  }

  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchComplains = async () => {
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch {
      toast.error("Failed to fetch complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Please enter both title and complaint.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      setTitle("");
      setBody("");
      toast.success("Complaint submitted successfully!");

      await fetchComplains();

      // Scroll to complaint list
      listRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      toast.error("Something went wrong while submitting.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex-column">
          <label>Title</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            placeholder="Enter your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex-column">
          <label>Complaint</label>
        </div>
        <div className="inputForm" style={{ height: '100px' }}>
          <textarea
            className="input"
            placeholder="Enter your complaint"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{
              resize: "none",
              height: "100%",
              width: "100%",
              border: "none",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        </div>

        <button
          className="button-submit"
          type="submit"
          disabled={isSaving || !title.trim() || !body.trim()}
        >
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      <h2 ref={listRef}>Complaints List</h2>

      <div className="complaints-container">
        <div className={`complaints-list ${isLoading ? "hidden" : "visible"}`}>
          {complains.length ? (
            complains.map((complain) => (
              <div key={complain.Id} className="complain-item enhanced-card">
                <h3>{complain.Title}</h3>
                <p>{complain.Body}</p>
                {complain.CreatedAt && (
                  <small style={{ color: "#666" }}>
                    Submitted on {new Date(complain.CreatedAt).toLocaleString()}
                  </small>
                )}
              </div>
            ))
          ) : (
            <p>No complaints available.</p>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
