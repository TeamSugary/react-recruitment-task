import { useState, useEffect } from "react";

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
    try {
      setErrorMessage(""); // Reset error message before submission
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
      if (!data.Success) throw new Error("Failed to save complaint.");
      // Missing: Update complaints list after successful submission
    } catch (e) {
      // Error state not being set
      setErrorMessage("Failed to submit complaint. Please try again.");
      console.error(e);
    } finally {
      setIsSaving(false);
      setBody(""); // Reset body after submission
      setTitle(""); // Reset title after submission

      // fetchComplains();
    }
  };

  useEffect(() => {
    if (!isSaving) fetchComplains();
  }, [isSaving]); // Missing dependency array cleanup

  return (
    <div className="w-screen  sm:px-0   mx-auto min-h-screen flex flex-col items-center justify-center gap-[20px] bg-[#DDDFE7] py-[60px]">
      <h2 className="font-inter text-[24px] font-bold uppercase">
        Submit a Complaint
      </h2>

      <div className="flex flex-col gap-[10px] items-center justify-center">
        <input
          className="w-[350px] sm:w-[960px] p-[12px] rounded-[8px] border border-neutral-900 outline-none font-inter text-[14px]"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-[350px] sm:w-[960px] p-[12px] rounded-[8px] border border-neutral-900 outline-none font-inter text-[14px]"
          placeholder="Enter your complaint"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-[350px] sm:w-[960px] p-[12px] rounded-[8px] bg-[#4B5563] text-white font-inter text-[14px] cursor-pointer hover:bg-[#374151] transition-colors duration-200 ease-in-out"
          disabled={isSaving || !title || !body} // Disable button if saving or fields are empty
        >
          {isSaving ? "Submitting..." : "Submit Complaint"}
        </button>

        {/* Place text loader when saving */}
        {/* Error message not displayed even though state exists */}
        {errorMessage && (
          <p className="font-inter text-red-500 text-[14px] font-semibold">
            {errorMessage}
          </p>
        )}
      </div>

      <h2 className="font-inter text-[24px] font-bold uppercase mt-[40px]">
        Complaints List
      </h2>

      {isLoading && !errorMessage && (
        <div className="font-inter text-[20px]">Loading...</div>
      )}

      {complains.length
        ? complains.map((complain) => (
            <div
              key={complain.Id}
              className="w-[350px] sm:w-[960px] flex flex-col gap-[5px] px-[24px] py-[30px] rounded-[4px] overflow-hidden shadow bg-white text-wrap"
            >
              <h3 className="font-inter font-semibold text-[24px] capitalize text-wrap">
                {complain.Title}
              </h3>
              <div className="w-full overflow-hidden">
                <p className="font-inter w-full text-[14px] text-[#777777]">
                  {complain.Body}
                </p>
              </div>
            </div>
          ))
        : !isLoading && (
            <p className="font-inter text-[24px] font-semibold">
              no complaints found
            </p>
          )}
    </div>
  );
}

export default App;
