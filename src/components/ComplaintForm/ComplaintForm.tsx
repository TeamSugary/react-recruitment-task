import React, { useState } from "react";
import useApiFetch from "../../hooks/UseFetch";
import { ApiResponse } from "../../types/types";

interface ComplaintFormProps {
  onComplaintSubmitted: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onComplaintSubmitted,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isLoading, error: apiError, fetchData } = useApiFetch<ApiResponse>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMessage("");

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    // Validation
    if (!trimmedTitle && !trimmedBody) {
      setValidationError("Please provide both a title and description");
      return;
    }
    if (!trimmedTitle) {
      setValidationError("Please provide a title");
      return;
    }
    if (!trimmedBody) {
      setValidationError("Please provide a description");
      return;
    }

    try {
      const response = await fetchData("TestApi/SaveComplain", {
        method: "POST",
        body: { Title: trimmedTitle, Body: trimmedBody },
      });

      if (response && response.Success) {
        setSuccessMessage("Complaint submitted successfully!");
        setTitle("");
        setBody("");

        // Notify parent component to refresh the complaints list
        onComplaintSubmitted();
      }
    } catch (error) {
      // API errors are handled by the hook
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Submit a Complaint</h2>

      {(apiError || validationError) && (
        <div className="error-message" role="alert">
          <p>{apiError || validationError}</p>
        </div>
      )}

      {successMessage && (
        <div className="success-message" role="status">
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="complaint-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Brief title of your complaint"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="form-input"
            aria-required="true"
            aria-invalid={validationError.includes("title")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Description
          </label>
          <textarea
            id="body"
            placeholder="Please describe your complaint in detail"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isLoading}
            rows={4}
            className="form-textarea"
            aria-required="true"
            aria-invalid={validationError.includes("description")}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="button-content">
              <span className="spinner"></span> Submitting...
            </span>
          ) : (
            "Submit Complaint"
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
