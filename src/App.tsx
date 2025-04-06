import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "./assets/Animation.json";
import { ImSpinner } from "react-icons/im";
import Swal from "sweetalert2";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';

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
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const fetchComplains = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchComplains();
  }, [fetchComplains]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Title and body are required.");
      toast.error("Title and body are required.");
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
      if (!data.Success) throw toast.error("Failed to save complaint.");
      Swal.fire({
        title: "Save Complaints!",
        icon: "success",
        draggable: true,
      });
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
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <div className="container">
              <ToastContainer />

      <nav className="nav">
        <div className="nav-logo">
          <img src="https://i.imgur.com/1VFZ2G8.png" alt="logo" />
          <h2 className="red-hat-display">SpeakUp</h2>
        </div>
        <button className="mode-toogle-button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <MdOutlineLightMode className="mode-toogle" /> : <MdOutlineNightlight className="mode-toogle" />}
        </button>
      </nav>
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
                {isSaving ? (
                  <ImSpinner className="spinner" />
                ) : (
                  "Submit Complaint"
                )}
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
        <div className="arrow-container2">
          <img className="arrow2" src="https://i.imgur.com/mmWqwXR.png" alt="" />
        </div>
        <div className="complain-list">
          {isLoading ? (
            <p className="loading">
              <ImSpinner className="spinner2" /> Loading...
            </p>
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
        <div className="arrow-container">
          <img className="arrow" src="https://i.imgur.com/mmWqwXR.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default App;
