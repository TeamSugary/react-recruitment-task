import { useState } from "react";
import { apiService } from "../services/ApiServer";
import { Notification } from "./Notification";
import "../styles/ComplaintForm.css";

interface ComplaintFormProps {
  onComplaintSubmitted: () => void;
}

export const ComplaintForm = ({ onComplaintSubmitted }: ComplaintFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!title.trim() || !body.trim()) {
      setErrorMessage("Please fill in both title and body");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await apiService.saveComplaint({ Title: title, Body: body });

      // Clear form fields after successful submission
      setTitle("");
      setBody("");
      setSuccessMessage("Complaint submitted successfully!");

      // Notify parent component
      onComplaintSubmitted();
    } catch (error) {
      console.error("Error saving complaint:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save complaint. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const dismissErrorMessage = () => {
    setErrorMessage("");
  };

  const dismissSuccessMessage = () => {
    setSuccessMessage("");
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          id="title"
          type="text"
          placeholder="Enter complaint title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
          required
        />
      </div>

      <div className="form-group">
        <textarea
          id="body"
          placeholder="Describe your complaint in detail"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isSaving}
          rows={5}
          required
        />
      </div>

      <button type="submit" className="submit-button" disabled={isSaving}>
        {isSaving ? (
          <>
            <span className="spinner"></span>
            Submitting...
          </>
        ) : (
          "Submit Complaint"
        )}
      </button>

      {errorMessage && (
        <Notification
          type="error"
          message={errorMessage}
          onDismiss={dismissErrorMessage}
        />
      )}

      {successMessage && (
        <Notification
          type="success"
          message={successMessage}
          onDismiss={dismissSuccessMessage}
        />
      )}
    </form>
  );
};
