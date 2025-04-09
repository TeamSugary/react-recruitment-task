import React from "react";
import { useForm } from "react-hook-form";
import { ComplaintFormProps, FormData } from "../types";
import Field from "./Common/Field";

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onSubmitSuccess,
  isSubmitting,
  submitError,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const success = await onSubmitSuccess(data);
    if (success) {
      reset(); // Reset form after successful submission
    }
  };

  return (
    <div className="complaint-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field label="Title" error={errors.title}>
          <input
            id="title"
            type="text"
            placeholder="Brief description of your complaint"
            {...register("title", {
              required: "Title is required",
            })}
            className={errors.title ? "input-error" : ""}
          />
        </Field>

        <Field label="Description" error={errors.body}>
          <textarea
            id="body"
            placeholder="Please provide details about your complaint"
            {...register("body", {
              required: "Complaint text is required",
              minLength: {
                value: 10,
                message: "Please provide at least 10 characters",
              },
            })}
            className={errors.body ? "input-error" : ""}
            rows={5}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`submit-button ${isSubmitting ? "submitting" : ""}`}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              <span>Submitting...</span>
            </>
          ) : (
            "Submit Complaint"
          )}
        </button>
      </form>

      {submitError && (
        <div className="error-banner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="error-icon"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
            />
          </svg>
          {submitError}
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
