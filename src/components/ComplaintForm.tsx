import { useState } from "react";
import {
  ComplaintSubmission,
  submitComplaint,
} from "../../services/complaintService";

interface ComplaintFormProps {
  onComplaintSubmitted: () => void;
}

const ComplaintForm = ({ onComplaintSubmitted }: ComplaintFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({
    title: "",
    body: "",
  });

  const validateForm = () => {
    const errors = {
      title: "",
      body: "",
    };
    let isValid = true;

    if (!title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!body.trim()) {
      errors.body = "Description is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const complaint: ComplaintSubmission = {
        Title: title,
        Body: body,
      };

      await submitComplaint(complaint);

      // Reset form
      setTitle("");
      setBody("");
      setFormErrors({ title: "", body: "" });

      // Notify parent component to refresh the complaints list
      onComplaintSubmitted();
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Submit a Complaint</h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="form-input"
              aria-invalid={!!formErrors.title}
              aria-describedby={formErrors.title ? "title-error" : undefined}
            />
            {formErrors.title && (
              <p id="title-error" className="form-error">
                {formErrors.title}
              </p>
            )}
          </div>

          <div className="form-group">
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your complaint"
              className="form-textarea"
              aria-invalid={!!formErrors.body}
              aria-describedby={formErrors.body ? "body-error" : undefined}
            />
            {formErrors.body && (
              <p id="body-error" className="form-error">
                {formErrors.body}
              </p>
            )}
          </div>

          <button type="submit" disabled={isSaving} className="btn btn-primary">
            {isSaving ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
