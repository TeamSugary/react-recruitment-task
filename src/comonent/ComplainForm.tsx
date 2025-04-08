import { useAppContext } from "../context/Context";

function ComplainForm() {
  const {
    title,
    setTitle,
    body,
    setBody,
    handleSubmit,
    isSaving,
    errorMessage,
  } = useAppContext();
  return (
    <div>
      <div className="form-container">
        <form className="form">
          <div className="form-field">
            <label htmlFor="title" className="label">
              Complaint Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Brief summary of your concern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="details" className="label">
              Detailed Description
            </label>
            <textarea
              id="details"
              rows={5}
              placeholder="Please describe your complaint in detail..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="textarea"
            />
          </div>

          <div className="form-actions">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button
              type="button"
              onClick={handleSubmit as React.MouseEventHandler<HTMLButtonElement>}
              disabled={isSaving}
              className={`submit-btn ${isSaving ? "disabled" : "active"}`}
            >
              {isSaving ? (
                <span className="loading">
                  <svg
                    className="loading-spinner"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ComplainForm;
