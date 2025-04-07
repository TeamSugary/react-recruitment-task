import { useState, useEffect, FormEvent, useRef } from "react";
import "./App.css";

// Types
type Type_Complaint = {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
};

type Type_Response<T = unknown> = {
  Success: boolean;
  Message?: string;
  Data?: T;
};

// API Endpoints
const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  // States
  const [complains, setComplains] = useState<Type_Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");

  // Refs
  const titleRef = useRef<HTMLInputElement>(null);
  const complaintsListRef = useRef<HTMLHeadingElement>(null);
  const currentToastRef = useRef<number | null>(null);

  // Show toast trigger
  const showToastTrigger = (msg: string) => {
    if (currentToastRef.current) clearTimeout(currentToastRef.current);

    setToastMessage(msg);

    currentToastRef.current = setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Close toast trigger
  const closeToastTrigger = () => {
    if (currentToastRef.current) clearTimeout(currentToastRef.current);
    setToastMessage("");
  };

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);

      if (!response.ok) throw new Error("Failed to fetch complaints.");

      const data: Type_Complaint[] = await response.json();

      setComplains(data);
    } catch (e: any) {
      showToastTrigger(e.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new complaint
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    setFormErrorMessage("");
    try {
      if (!title.trim()) {
        setFormErrorMessage("Title is required.");
        return;
      }

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

      const data: Type_Response = await response.json();

      if (!data.Success)
        throw new Error(data.Message || "Failed to save complaint.");

      // Clearing Form
      setTitle("");
      setBody("");

      // Updating Complains
      await fetchComplains();

      // Auto Focus on Title
      titleRef.current?.focus();

      // Scroll to complaints list
      setTimeout(() => {
        complaintsListRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);

      // Show success toast
      showToastTrigger("Complaint saved successfully.");
    } catch (e: any) {
      showToastTrigger(e.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    titleRef.current?.focus();

    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      await fetchComplains();
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="wrapper">
      {toastMessage && (
        <Toast message={toastMessage} onClose={closeToastTrigger} />
      )}
      <h2>Submit a Complaint</h2>

      <form className="complain-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          ref={titleRef}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>
        {/* Text Loader for Saving */}
        {isSaving && <p className="loader">Saving...</p>}
        {/* Save Error Message */}
        {formErrorMessage && (
          <p className="error-message">{formErrorMessage}</p>
        )}
      </form>

      <h2 ref={complaintsListRef}>Complaints List</h2>

      {isLoading ? (
        <p>Loading...</p>
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

// Notification Toast
//Type
type Type_ToastProps = {
  message: string;
  onClose: () => void;
};
const Toast = ({ message, onClose }: Type_ToastProps) => {
  return (
    <div className="toast">
      <p>{message}</p>
      <button onClick={onClose}>X</button>
    </div>
  );
};
