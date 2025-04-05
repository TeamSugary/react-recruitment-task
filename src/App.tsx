import { useState, useEffect } from "react";
import Toast from "./components/shared/toast/Toast";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchComplains = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setComplains(data);
      // console.log(data);

    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to fetch complaints");
      }
      Toast.show("Failed to fetch complaints", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (title: string, body: string) => {
    try {
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
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.Success) {
        throw new Error(data.Message || "Failed to submit complaint");
      }
      Toast.show("Complaint submitted successfully!", "success");
      fetchComplains(); // refresh after submission
    } catch (error) {
      if (error instanceof Error) {
        Toast.show(error.message, "error");
      } else {
        Toast.show("Failed to submit complaint", "error");
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchComplains();

    return () => {
      controller.abort(); // Cleanup function to abort fetch request
    }
  }, []);

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

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
        />

        <button onClick={() => handleSubmit(title, body)}>
          Submit Complaint
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
        {errorMessage && <p>{errorMessage}</p>}
      </div>

      <h2>Complaints List</h2>

      {isLoading ? (
        <div>Loading...</div>
      ) : complains.length ? (
        complains.map((complain) => (
          <div key={complain.Id} className="complain-item">
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
