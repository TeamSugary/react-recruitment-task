import { useState, useEffect } from 'react';
import "./App.css"
import { TComplain } from './types/complain';
import PuffLoader from "react-spinners/PuffLoader";
import ComplaintForm from './components/ComplaintForm';
import { baseUrl, listPath } from './consts/api';

function App() {
  const [complains, setComplains] = useState<TComplain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // issaving state is lifted to fetch after submitting new complain.
  const [isSaving, setIsSaving] = useState(false);


  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
      setIsLoading(false);
    } catch (error: any) {
      setFetchError("Something Went Wrong. PLease try again.")
    }
  };


  useEffect(() => {
    if (!isSaving) {
      fetchComplains();
    }

  }, [isSaving]);

  return (
    <div className="wrapper">
      <div className="container">
        <h2>Submit a Complaint</h2>

        {/* complain form */}
        <ComplaintForm setIsSaving={setIsSaving} isSaving={isSaving}/>

        <h2>Complaints List</h2>
        <div className="complaints" style={{ position: "relative" }}>
          {/* fetch complain error */}
          {fetchError && <p style={{ color: "#ff5858" }}>{fetchError}</p>}

          {/* loading component */}
          {isLoading && (

            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
              <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} className="complain-item">
                <PuffLoader
                  color='white'
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                <h3></h3>
                <h3></h3>
              </div>

            </div>
          )}

          {/* complaints */}
          {complains.length ? (
            complains.map((complain: TComplain) => (
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