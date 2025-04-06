import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: "", body: "" });

  const fetchComplains = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch (e) {
      setErrorMessage((prev) => ({ ...prev, body: "Failed to fetch complaints." }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    if (!title) {
      setErrorMessage((prev) => ({ ...prev, title: "Title is required." }));
      hasError = true;
    } else {
      setErrorMessage((prev) => ({ ...prev, title: "" }));
    }

    if (!body) {
      setErrorMessage((prev) => ({ ...prev, body: "Body is required." }));
      hasError = true;
    } else {
      setErrorMessage((prev) => ({ ...prev, body: "" }));
    }

    if (hasError) return;

    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Save failed");

      toast.success("Complaint submitted!");
      await fetchComplains();
      setTitle("");
      setBody("");
    } catch (e) {
      toast.error("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <div style={styles.singleCard}>
          <h2 style={styles.heading}>Submit Complaint</h2>
          <input
            style={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errorMessage.title && <p style={styles.error}>{errorMessage.title}</p>}

          <textarea
            style={styles.textarea}
            placeholder="Your complaint"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {errorMessage.body && <p style={styles.error}>{errorMessage.body}</p>}

          <button
            onClick={handleSubmit}
            disabled={isSaving || !title || !body}
            style={{
              ...styles.button,
              backgroundColor: isSaving || !title || !body ? "#999" : "#ff6b00",
            }}
          >
            {isSaving ? "Submitting..." : "Submit"}
          </button>

          <h2 style={{...styles.heading, marginTop: "2rem"}}>Complaints</h2>
          {isLoading ? (
            <p style={styles.loading}>Loading...</p>
          ) : complains.length > 0 ? (
            complains.map((complain: any) => (
              <div key={complain.Id} style={styles.complaint}>
                <h4>{complain.Title}</h4>
                <p>{complain.Body}</p>
              </div>
            ))
          ) : (
            <p>No complaints yet.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    minHeight: "100vh",
    width: "99vw",
    backgroundImage: "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1950&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    padding: "2rem 1rem",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 0,
  },
  content: {
    position: "relative",
    zIndex: 1,
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto",
  },
  singleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    padding: "1.5rem",
    color: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  heading: {
    fontSize: "clamp(1.2rem, 2vw, 1.4rem)",
    marginBottom: "1rem",
    color: "#ff6b00",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "0.5rem",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "0.5rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  complaint: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "0.875rem",
    marginBottom: "0.5rem",
  },
  loading: {
    color: "#ddd",
  },
};

export default App;