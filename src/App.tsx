import { useState, useEffect, useCallback } from 'react';
import { IoStatsChartOutline, IoCodeWorkingOutline } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import { FaRegUser, FaRegCircleCheck } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { FcApproval } from "react-icons/fc";


const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

type Complain = {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

function validateComplaint(title: string, body: string): string {
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  const isOnlyNumbers = /^\d+$/;
  const hasSpecialChars = /[^a-zA-Z0-9 ]/;

  switch (true) {
    case !trimmedTitle && !trimmedBody:
      return "Title and complain both fields are required.";

    case !trimmedBody:
      return "Please enter your complaint.";

    case !trimmedTitle:
      return "Title is required.";

    case isOnlyNumbers.test(trimmedTitle):
      return "Title should not contain numbers only.";

    case isOnlyNumbers.test(trimmedBody):
      return "Complain should not contain numbers only.";

    case trimmedTitle.length > 50:
      return "Title must be less than or equal to 50 characters.";

    case trimmedBody.length > 200:
      return "Complain must be less than or equal to 200 characters.";

    case hasSpecialChars.test(trimmedTitle):
      return "Title should not contain special characters.";

    default:
      return "";
  }
}

export default function App() {

  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // modal open and close
  const openModal = () => {
    console.log("open clicked")
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  // Fetch complaints from the API
  const fetchComplains = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data: Complain[] = await response.json();
    setComplains(data);
    setIsLoading(false);
  }, []);

  // Save a new complaint
  const handleSubmit = async () => {
    //add validatiion code here
    const error = validateComplaint(title, body);
    if (error) {
      setErrorMessage(error);
      return;
    }
    openModal();
    try {
      setIsSaving(true);
      setErrorMessage(""); // Clear previous error---sebelly edit
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
      if (!data.Success) throw new Error("Failed to save complaint.");
      else {
        setIsSaving(false);
      }
      // Missing: Update complaints list after successful submission
      // Clear input and refresh list
      setTitle("");// sebelly edit
      setBody("");// sebelly edit
      await fetchComplains();// sebelly edit
    } catch (err) {
      // Error state not being set
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
    fetchComplains();
  };

  useEffect(() => {
    fetchComplains();
  }, [fetchComplains]); // Missing dependency array cleanup

  return (
    <>
      <div className="wrapper">
        <h2>Submit a Complaint</h2>

        <div className="complain-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter your complaint"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <button onClick={handleSubmit}>
            Submit Complaint {/* // sebelly edit */}
          </button>

          {/* Place text loader when saving */}
          {/* // sebelly edit */}
          {isSaving && <div>Saving...</div>}
          {/* Error message not displayed even though state exists */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>

        <div className="complain-info">
          <p className='complain-stat'><IoStatsChartOutline /> Total {complains.length} complains</p>
          <p className='complain-stat'><IoCodeWorkingOutline /> In progress 3</p>
          <p className='complain-stat'><TiTickOutline /> Solved 12</p>
        </div>

        <h2>Complaints List</h2>

        {isLoading ? (
          // <div>Loading...</div>
          <div className='loader'></div>
        ) : complains.length ? (
          complains.map((complain) => (
            <div
              key={complain.Id}
              className="complain-item">
              <h3>{complain.Title}</h3>
              <p>{complain.Body}</p>
              <div className='complain-footer'>
                <small style={{ opacity: 0.7 }}>
                  <FaRegUser /> user name
                </small>
                <small style={{ opacity: 0.7 }}>
                  Created {timeAgo(complain.CreatedAt)}
                </small>
                <button className='icon-button'><MdDeleteOutline className='icon' /> Delete</button>
                <button className='icon-button'><FaRegCircleCheck className='icon' /> Resolve</button>
              </div>
            </div>
          ))
        ) : (
          <p>No complaints available.</p>
        )}
      </div>

      {/* modal for saving... */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {
              isSaving ? (
                <div className="modal-header">
                  <h3 style={{ color: "gray" }}>Saving your complain</h3>
                  <div className='loader-in-modal'></div>
                </div>
              ) : (
                <div className="modal-header">
                  <div>
                    <h3 style={{ color: "gray" }}>Success</h3>
                    <FcApproval className='modal-icon' />
                  </div>
                  <button className='modal-close' onClick={closeModal}>Ok</button>
                </div>
              )
            }
          </div>
        </div>
      )}
    </>
  );
}

// export default App;