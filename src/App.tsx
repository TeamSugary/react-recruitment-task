import { useEffect, useState } from "react";
import { fetchComplaints, saveComplaint } from "./Api/api";
import "./App.css";
import Tooltip from "./Components/Common/Tooltip";
import ComplaintForm from "./Components/ComplaintForm";
import ComplaintsList from "./Components/ComplaintsList";
import { Complaint, FormData } from "./types";

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Separate error states for different operations
  const [fetchError, setFetchError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  // Show tooltip function
  const showTooltip = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    // First reset any existing tooltip to ensure animation plays again
    setTooltip({ visible: false, message: "", type: "success" });

    // Small delay to ensure the component remounts
    setTimeout(() => {
      setTooltip({ visible: true, message, type });
    }, 10);

    // Auto-hide tooltip after 5 seconds
    setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Handle complaint submission with smooth UI updates
  const handleSaveComplaint = async (formData: FormData): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(""); // Only clear submit errors
    try {
      const result = await saveComplaint(formData);
      // Add the new complaint to the state
      setComplaints((prevComplaints) => [
        {
          Id: result.Id || Date.now(), // Use the returned ID or fallback to timestamp
          Title: formData.title,
          Body: formData.body,
        },
        ...prevComplaints, // Add new complaint at the top
      ]);

      // Show success tooltip
      showTooltip("Your complaint has been successfully submitted!");

      return true;
    } catch (error) {
      console.error("Error saving complaint:", error);
      const errorMsg = "Failed to submit complaint. Please try again.";
      setSubmitError(errorMsg); // Set only submit error

      // Show error tooltip
      showTooltip(errorMsg, "error");

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch complaints on component mount
  useEffect(() => {
    const controller = new AbortController();
    // Define the loading function directly in useEffect
    const loadComplaints = async () => {
      setIsLoading(true);
      setFetchError(""); // Only clear fetch errors
      try {
        const data = await fetchComplaints();
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        const errorMsg = "Failed to load complaints. Please try again later.";
        setFetchError(errorMsg); // Set only fetch error

        // Show error tooltip for fetch errors
        showTooltip(errorMsg, "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadComplaints();
    // Clean up when component unmounts
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array since we're only running on mount

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <h1>Customer Feedback Portal</h1>
          <p>
            We value your feedback and are committed to addressing your concerns
          </p>
        </header>
        <section className="form-section">
          <h2>Submit a Complaint</h2>
          <ComplaintForm
            onSubmitSuccess={handleSaveComplaint}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </section>
        <section className="list-section">
          <h2>Recent Complaints</h2>
          <ComplaintsList
            complaints={complaints}
            isLoading={isLoading}
            fetchError={fetchError}
          />
        </section>
      </div>

      {/* Tooltip component */}
      <Tooltip
        visible={tooltip.visible}
        message={tooltip.message}
        type={tooltip.type}
        onClose={() => setTooltip((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

export default App;
