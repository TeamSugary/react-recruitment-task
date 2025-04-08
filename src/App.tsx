import { useState } from "react";
// import './App.css';
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "./context/Context";
import Header from "./comonent/Header";
import ComplaintsList from "./comonent/ComplaintsList";
import Pagination from "./comonent/Pagination";
import useFetchComplaints from "./hooks/useFetchComplaints";
import ComplainForm from "./comonent/ComplainForm";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 8;
  const { complains, isLoading } = useAppContext();

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
      <ComplainForm />
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
