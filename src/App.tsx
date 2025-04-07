import { useState, useEffect, useRef } from "react";

import "./App.css";
import PlusIcon from "./assets/plus-icon";
import CheckIcon from "./assets/check-icon";

const API = {
  baseUrl: "https://sugarytestapi.azurewebsites.net/",
  endpoints: {
    list: "TestApi/GetComplains",
    save: "TestApi/SaveComplain",
  },
};

interface ComplaintResponse {
  Id: number;
  Title: string;
  Body: string;
  CreatedAT: string;
}

function App() {
  const [complaints, setComplaints] = useState<Array<ComplaintResponse>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Fetch complaints from the API
  const fetchComplaints = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API.baseUrl}${API.endpoints.list}`);

      if (!response.ok)
        throw new Error(`Request failed with status: ${response.status}`);

      const data = await response.json();
      setComplaints(data);
    } catch (e: unknown) {
      console.error(
        "Failed to fetch complaints:",
        e instanceof Error ? e.message : "Unknown error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const hideForm = () => setShowForm(false);

  return (
    <main>
      <ComplaintForm
        showForm={showForm}
        hideForm={hideForm}
        updateList={fetchComplaints}
      />
      <div className="wrapper">
        <section className="complaints-header">
          <h1>Complaints List</h1>
          <button
            onClick={() => setShowForm(true)}
            className="complaints-button"
          >
            <PlusIcon />
          </button>
        </section>
        <ComplaintsList isLoading={isLoading} complaints={complaints} />
      </div>
    </main>
  );
}

const ComplaintForm: React.FC<{
  showForm: boolean;
  hideForm: () => void;
  updateList: () => void;
}> = ({ showForm, hideForm, updateList }) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const success = useRef<boolean>(false);

  const timeOutID = useRef<number | null>(null);

  // Save a new complaint
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setErrorMessage("");
      setIsSaving(true);

      if (title.trim() === "")
        throw Error("Please enter a title for your complaint.");
      if (body.trim() === "")
        throw new Error("Please describe your complaint.");
      if (body.trim().length > 500)
        throw new Error(
          "Your complaint text exceeds the maximum allowed length of 500 characters.",
        );

      const formData = {
        Title: title,
        Body: body,
      };

      const response = await fetch(`${API.baseUrl}${API.endpoints.save}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(`Request failed with status: ${response.status}`);

      const data = await response.json();
      if (!data.Success)
        throw new Error("Failed to save complaint. Please try again.");

      // Update complaints list after successful submission
      setTitle("");
      setBody("");

      success.current = true;

      updateList();
    } catch (e: unknown) {
      setErrorMessage(
        e instanceof Error ? e.message : "An unknown error occurred",
      );
    } finally {
      setIsSaving(false);

      if (timeOutID.current) clearTimeout(timeOutID.current);

      if (success.current)
        timeOutID.current = setTimeout(() => {
          hideForm();
          success.current = false;
        }, 1500);
    }
  };

  return (
    <section
      aria-hidden={!showForm}
      role="dialog"
      className={`complaint-form-section ${!showForm ? "hidden" : ""}`}
    >
      <div
        className={` ${!success.current ? "hidden" : "success-screen-container"} `}
      >
        <SuccessScreen />
      </div>

      <div className="complaint-form-container">
        <h2 className="complaint-form-header">Submit a Complaint</h2>

        <form onSubmit={handleSubmit} className="complaint-form">
          <label htmlFor="complaint-title" className="visually-hidden">
            Complaint Title
          </label>
          <input
            id="complaint-title"
            className={`complaint-title ${errorMessage ? "error-input" : ""}`}
            type="text"
            placeholder="Title"
            name="ctitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-required
            aria-invalid={errorMessage ? "true" : "false"}
          />

          <label htmlFor="complaint-body" className="visually-hidden">
            Complaint Description
          </label>
          <textarea
            id="complaint-body"
            className={`complaint-body ${errorMessage ? "error-input" : ""}`}
            placeholder="Enter your complaint"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            aria-required
            aria-invalid={errorMessage ? "true" : "false"}
          />

          {errorMessage && (
            <div role="alert" className="error">
              {errorMessage}
            </div>
          )}

          <div className="button-group">
            <button
              className="btn"
              type="submit"
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setErrorMessage("");
                hideForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const ComplaintsList: React.FC<{
  isLoading: boolean;
  complaints: Array<ComplaintResponse>;
}> = ({ isLoading, complaints }) => {
  return (
    <section className="complaints-list">
      {isLoading ? (
        <div className="loader-container">
          <div>
            <div className="loader" />
          </div>
        </div>
      ) : complaints.length ? (
        complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.Id}
            title={complaint.Title}
            content={complaint.Body}
          />
        ))
      ) : (
        <p className="no-complaints">No complaints available.</p>
      )}
    </section>
  );
};

const ComplaintCard: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  const [style, setStyle] = useState<React.CSSProperties>();

  const setRandomColor = () => {
    const color = getRandomColor();
    const style = {
      "--color": color,
    } as React.CSSProperties;
    setStyle(style);
  };

  useEffect(() => {
    setRandomColor();
  }, []);

  return (
    <div className="card" style={style} onClick={setRandomColor}>
      <p className="card-title">{title}</p>
      <div>
        <p className="card-content">{content}</p>
      </div>
    </div>
  );
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const SuccessScreen = () => {
  return (
    <div className="success-screen-container">
      <div>
        <CheckIcon className="success-icon" />
      </div>
      <p>Your complaint has been successfully submitted.</p>
    </div>
  );
};

export default App;
