import { useState, useEffect } from 'react';
import './App.css';
import Skeleton from './components/atoms/Skeleton';
import Modal from './components/atoms/Modal';
import { Complain } from './types/types'


const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);




  // Fetch complaints from the API
  const fetchComplains = async () => {

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Failed to fetch complaints.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }



  };

  // Save a new complaint
  const handleSubmit = async () => {
    setIsSaving(true);

    if (!title.trim() || !body.trim()) {
      setErrorMessage("Title and Body must not be empty.");
      setShowModal(true);
      setIsSaving(false);
      return;
    }




    try {

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
      setResponse(data);
      setBody("");
      setTitle("");

    
      if (!data.Success) throw new Error("Failed to save complaint.");

    } catch (error) {
      const message = error instanceof Error ? error.message: "Something went wrong. Please try again.";
      setIsSaving(false);
      setErrorMessage(message)
      setShowModal(true);

    
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, [response]); 

  return (
    <div className="wrapper">
      <Modal text={errorMessage} showModal ={showModal} SetShowModal={setShowModal}/>

      <div>
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
            {isSaving ? 'Submitting...' : 'Submit Complaint'}
          </button>

        </div>
      </div>




      <div>
        <h2>Complaints List</h2>

        <div className='complains-list'>
          {isLoading ? (
            <Skeleton />
          ) : complains.length ? (
            complains.map((complain : Complain) => (
              <div key={complain.Id} className="complain-item">
                <h3>{complain.Title}</h3>
                <p>{complain.Body}</p>
              </div>
            ))
          ) : (
            <p>No complaints available.</p>
          )}
        </div>
      </div>



    </div>
  );
}

export default App;