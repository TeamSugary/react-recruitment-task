import React, { useState, ChangeEvent } from "react";
import { saveComplaint } from "../api/complaints";
import { Complaint } from "../types/complaint";

interface ComplaintFormProps {
  onSuccess: () => void;
}

interface APIError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Complaint>({
    Title: "",
    Body: "",
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ Title?: string; Body?: string }>({});
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async () => {
    const { Title, Body } = formData;

    const newErrors: { Title?: string; Body?: string } = {};
    if (!Title.trim()) newErrors.Title = "Complaint title is required.";
    if (!Body.trim()) newErrors.Body = "Complaint description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});
      await saveComplaint(Title, Body);
      setFormData({ Title: "", Body: "" });
      onSuccess();
    } catch (err: unknown) {
      const error = err as APIError;
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      setErrors({ Title: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="complain-form">
      <label htmlFor="Title">Complaint Title</label>
      <input
        id="Title"
        value={formData.Title}
        onChange={handleChange}
        placeholder="Enter title"
      />
      {errors.Title && <div className="error">{errors.Title}</div>}

      <label htmlFor="Body">Complaint Description</label>
      <textarea
        id="Body"
        value={formData.Body}
        onChange={handleChange}
        placeholder="Describe your complaint"
      />
      {errors.Body && <div className="error">{errors.Body}</div>}

      <button onClick={handleSubmit} disabled={isSaving}>
        {isSaving ? "Submitting..." : "Submit Complaint"}
      </button>
    </div>
  );
};

export default ComplaintForm;
