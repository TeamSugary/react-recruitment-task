/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "./App.css";
import ComplaintForm from "./components/ComplaintForm/ComplaintForm";
import toast from "react-hot-toast";
import ComplaintViewer from "./components/ComplaintViewer/ComplaintViewer";
import Loader from "./components/Loader/Loader";

export const baseUrl = "https://sugarytestapi.azurewebsites.net/TestApi";
export const listPath = "/GetComplains";
export const savePath = "/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        await fetchComplains();
      } catch (error: any) {
        if (isMounted) {
          toast.error(error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="wrapper">
      <ComplaintForm fetchComplains={fetchComplains} />
      <ComplaintViewer complains={complains} />
    </div>
  );
}

export default App;
