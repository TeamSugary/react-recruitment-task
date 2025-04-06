import { useState, useEffect } from "react";
import "./App.css";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "./assets/Animation.json";

// API URLs
const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
}

interface SaveResponse {
  Success: boolean;
  Message?: string;
}

function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data: Complaint[] = await response.json();
      setComplains(data);
    } catch {
      setErrorMessage("Failed to fetch complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Title and body are required.");
      return;
    }

    try {
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

      const data: SaveResponse = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      await fetchComplains();
      setTitle("");
      setBody("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="container">
      <div>
        <h2 className="form-title">Submit a Complaint</h2>
        <p className="form-subtitle">
          Let us know your concern — we're here to help.
        </p>
      </div>
      <div className="form-wrapper">
        <div className="form-container">
          <div className="side-image-container">
            <motion.img
              className="side-image"
              src={"https://i.imgur.com/K2477Rs.png"}
              alt="moving image"
              animate={{
                x: [0, 0, 100, 0],
                y: [0, 30, 0, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="complain-form">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="input"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="textarea"
                placeholder="Enter your complaint"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

              {errorMessage && <p className="error">{errorMessage}</p>}
              <button className="button" type="submit" disabled={isSaving}>
                {isSaving ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="list-wrapper">
        <div className="lottie-background">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{
              width: "300px", // প্রয়োজন অনুযায়ী adjust করো
              height: "300px",
              position: "absolute",
            }}
          />
        </div>
        <div className="list-title-container">
          <h2 className="list-title">Complaints List</h2>
          <p className="list-subtitle">
            Here are all the submitted complaints from users.
          </p>
        </div>

        {/* Lottie Animation Background */}

        <div className="complain-list">
          {isLoading ? (
            <p className="loading">Loading...</p>
          ) : complains.length ? (
            complains.map((complain) => (
              <div key={complain.Id} className="complain-card">
                <h3>{complain.Title}</h3>
                <p>{complain.Body}</p>
              </div>
            ))
          ) : (
            <p className="no-complain">No complaints available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
