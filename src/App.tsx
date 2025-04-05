/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
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
  const isMounted = useRef(true);

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setComplains(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load complaints");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchComplains();
      } catch (error: any) {
        if (isMounted.current) {
          toast.error(error.message || "Failed to load complaints");
        }
      }
    };
    fetchData();

    return () => {
      isMounted.current = false;
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
