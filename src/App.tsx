import { useEffect, useState } from "react";
// import './App.css';
import "./index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Complain {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
}

export interface ComplainFormType {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  body: string;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: Function;
  isSaving: boolean;
  errorMessage: string;
}
function App() {
  const baseUrl = "https://sugarytestapi.azurewebsites.net/";
  const listPath = "TestApi/GetComplains";
  const savePath = "TestApi/SaveComplain";
  const [currentPage, setCurrentPage] = useState(1);
  const [complains, setComplains] = useState<Complain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refetchComplains, setRefetchComplains] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const complaintsPerPage = 8;

  const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const fetchComplains = async (): Promise<Complain[]> => {
    await wait(2000);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data: Complain[] = await response.json();
    return data;
  };

  function handleError(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (typeof error === "object" && error !== null && "message" in error) {
      return String(error.message);
    }
    return "An unknown error occurred";
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required!");
      setErrorMessage("Title is required!");
      return;
    }
    if (!body.trim()) {
      toast.error("Body is required!");
      setErrorMessage("Body is required!");
      return;
    }
    try {
      setIsSaving(true);
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
      const data = await response.json();
      // if (!data.Success) throw new Error(data.Message);

      if (!data.Success) {
        if (
          data.Message?.includes("String or binary data would be truncated")
        ) {
          toast.error("Complaint is too long. Please shorten your message.");
          throw new Error(
            "Complaint is too long. Please shorten your message."
          );
        } else {
          toast.error(data.Message || "Failed to save complaint.");
        }
        throw new Error(data.Message || "Failed to save complaint.");
      }
      setTitle("");
      setBody("");
      setErrorMessage("");
      toast.success("Complaint submitted successfully!");
      setRefetchComplains(!refetchComplains);
    } catch (e) {
      setErrorMessage(handleError(e));
    } finally {
      setIsSaving(false);
    }
  };
  
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetchComplains();
        if (isMounted) setComplains(response);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [refetchComplains]);


  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = complains.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );
  const totalPages = Math.ceil(complains.length / complaintsPerPage);
  const [showFullBody, setShowFullBody] = useState(false);

  const handleBody = () => {
    setShowFullBody(!showFullBody);
  };
  return (
    <div className="complaint-page">
      <header className="header">
        <h2 className="header-title">Submit a Complaint</h2>
        <p className="header-description">
          We value your feedback. Please submit your concerns below.
        </p>
      </header>
      {/* Form Part */}
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
              onClick={
                handleSubmit as React.MouseEventHandler<HTMLButtonElement>
              }
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
      {/* ComplaintsList */}
      <div className="complaint-list-container">
        <div className="complaints-list">
          <h2 className="complaints-title">Recent Complaints</h2>

          {isLoading ? (
            <div className="loading-center">
              <div className="loading-spinner"></div>
              {/* <p>Loading..........</p> */}
            </div>
          ) : complains.length ? (
            <div className="complaints-cards">
              {currentComplaints.map((complain) => (
                <div className="complain-card">
                  <div key={complain.Id} className="complain-card-content">
                    <div className="complain-header">
                      <h3 className="complain-title">{complain.Title}</h3>
                    </div>
                    <div className="complain-date-container">
                      <p className="complain-date">
                        {new Date(complain.CreatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {complain.Body.length > 100 ? (
                      !showFullBody ? (
                        <div className="show-more">
                          <p className="complain-body">
                            {complain.Body.slice(0, 100)}...
                            <button className="showbtn" onClick={handleBody}>
                              Read More
                            </button>
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="complain-body">{complain.Body}</p>
                          <button className="showbtn" onClick={handleBody}>
                            Read Less
                          </button>
                        </div>
                      )
                    ) : (
                      <p className="complain-body">{complain.Body}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-complaints">
              <svg
                className="no-complaints-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="no-complaints-title">No complaints</h3>
              <p className="no-complaints-description">
                Be the first to submit a complaint.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
