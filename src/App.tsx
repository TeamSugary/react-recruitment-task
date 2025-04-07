import { useState } from "react";
// import './App.css';
import "./index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError } from "./utils/errorHandler";
import { useAppContext } from "./context/Context";
import Header from "./comonent/Header";
import ComplaintsList from "./comonent/ComplaintsList";
import Pagination from "./comonent/Pagination";
import useFetchComplaints from "./hooks/useFetchComplaints";
import ComplainForm from "./comonent/ComplainForm";
export const baseUrl = "https://sugarytestapi.azurewebsites.net/";
export const listPath = "TestApi/GetComplains";
export const savePath = "TestApi/SaveComplain";

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 8;
  const {
    complains,
    isLoading,
    isSaving,
    setIsSaving,
    errorMessage,
    setErrorMessage,
    refetchComplains,
    setRefetchComplains,
  } = useAppContext();

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

  useFetchComplaints();

  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = complains.slice(
    indexOfFirstComplaint,
    indexOfLastComplaint
  );
  return (
    <div className="complaint-page">
      <Header />
      <ComplainForm
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
        handleSubmit={handleSubmit}
        isSaving={isSaving}
        errorMessage={errorMessage}
      />
      <ComplaintsList isLoading={isLoading} complains={currentComplaints} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(complains.length / complaintsPerPage)}
        onPageChange={setCurrentPage}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
