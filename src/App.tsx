import { useState, useEffect } from "react";
import "./App.css";
import ComplaintForm from "./components/ComplaintForm/ComplaintForm";

const baseUrl = "https://sugarytestapi.azurewebsites.net/TestApi";
const listPath = "/GetComplains";
const savePath = "/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
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
    try {
      setIsSaving(true);
      const response = await fetch(savePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: "Test Title",
          Body: "Test Body",
        }),
      });
      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
    } catch (e) {
      // Error state not being set
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup

  return (
    <div className="wrapper">
      <ComplaintForm />
    </div>
  );
}

export default App;
