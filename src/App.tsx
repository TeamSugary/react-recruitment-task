import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch complaints from the API
  const fetchComplains = async () => {
    try {
      setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    } catch (e) {
      setErrorMessage("Failed to fetch complaints.");
    }finally{

      setIsLoading(false);
    }
  };

  // Save a new complaint
  const handleSubmit = async () => {
    try {
      if (!title || !body) {
        setErrorMessage("Title and body cannot be empty.");
        return;
      }
      setIsSaving(true);
      setErrorMessage(""); 
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
      if (!data.Success) throw new Error("Failed to save complaint.");
      toast.success("Complaint submitted successfully!");
      // Missing: Update complaints list after successful submission
      await fetchComplains();
      setTitle("");
      setBody("");
    } catch (e) {
      // Error state not being set\
      // setErrorMessage((e as Error).message || "Failed to save complaint.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup

  return (
    <div className="wrapper" style={styles.wrapper}>
      <h2 style={styles.heading}>Submit a Complaint</h2>

      <div className="complain-form" style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={handleSubmit}
        disabled={isSaving || !title || !body}
        style={{
          ...styles.button,
          backgroundColor: isSaving ? "#888" : "#ff6b00",
          cursor: isSaving ? "not-allowed" : "pointer",
        }}
        >
          {isSaving ? 'Submitting...' : 'Submit Complaint'}
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      
        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
      </div>

      <h2>Complaints List</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : complains.length ? (
        <div style={styles.list}>
          {complains.map((complain: any) => (
            <div key={complain.Id} className="complain-item" style={styles.card}>
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No complaints available.</p>
      )}
      <ToastContainer />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
    color: "#eee",
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
  },
  heading: {
    color: "#ff6b00",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minHeight: "100px",
  },
  button: {
    padding: "0.6rem 1rem",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "red",
    marginTop: "0.5rem",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    padding: "1rem",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
};

export default App;