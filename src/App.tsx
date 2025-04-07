import { useEffect, useState } from "react";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    setIsLoading(false);
  };

  // Save a new complaint
  const handleSubmit = async () => {
    if (!title.trim() && !body.trim()) {
      alert("Please fill out the title and description fields!");
      return;
    }

    if (!title.trim()) {
      alert("Please add Complaint title!");
      return;
    }

    if (!body.trim()) {
      alert("Please add Complaint description!");
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
      console.log("Data", data);
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
      alert("Complaint saved successfully!");
      setTitle("");
      setBody("");
      fetchComplains();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Error saving complaint: ${error.message}`);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      // Error state not being set
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup
  return (
    <div className="wrapper flex flex-col items-center justify-center overflow-x-hidden relative bg-gradient-to-r from-[#3f87a6]  to-[#9198e5]">
      <h2 className="text-white text-center relative z-50 text-3xl font-bold my-10 outline-none">
        Submit a Complaint
      </h2>
      <div className=" flex flex-col items-center w-[100vw] z-50 bg">
        <div className="complain-form flex flex-col gap-5 lg:w-[650px] md:w-[650px] w-full md:px-0 px-5 mb-5 items-center p-5">
          <input
            className="h-[70px] bg-white/40 backdrop-blur-sm px-4 rounded-xl w-full text-black"
            type="text"
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter your complaint"
            className="h-[120px] bg-white/40 backdrop-blur-sm pt-3 rounded-xl px-4 resize-none w-full text-black "
            value={body}
            required
            onChange={(e) => setBody(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="sm:w-1/2 bg-gradient-to-r from-[#6091e6] via-[#4c83e1] to-[#1592ac] outline-none w-full p-3 rounded-3xl text-lg font-semibold cursor-pointer hover:shadow-xl shadow-sm"
          >
            {isSaving ? "Submitting..." : "Submit Complaint"}
          </button>

          {/* Place text loader when saving */}

          {isSaving && (
            <p className="text-blue-500">
              Submitting complaint, please wait...
            </p>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Error message not displayed even though state exists */}
        </div>

        <h2 className="text-white mb-4 text-2xl font-semibold">
          Complaints List
        </h2>

        <div className="md:w-[650px] w-full md:px-0 px-5">
          {isLoading ? (
            <div className="text-black">Loading...</div>
          ) : complains.length ? (
            complains.map((complain) => (
              <div
                key={complain.Id}
                className="complain-item my-5 bg-white/20 backdrop-blur-md text-white rounded-xl px-4 py-2 flex flex-col gap-3"
              >
                <h3 className="text-xl font-semibold">{complain.Title}</h3>
                <p className="text-base">{complain.Body}</p>
              </div>
            ))
          ) : (
            <p className="text-black">No complaints available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
