import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {

  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load complaints!',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!title.trim() || !body.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Form Error',
        text: 'Please fill in both the title and body.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to submit complaint");

      setTitle(""); 
      setBody(""); 

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Complaint submitted successfully!',
        confirmButtonColor: '#28a745',
      });

      fetchComplains();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'Failed to submit complaint.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-purple-800 mb-12">
          Submit Your Complaint
        </h1>

        {/* Complaint Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-xl font-medium text-gray-700 mb-1">
                Complaint Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                placeholder="Title"
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-xl font-medium text-gray-700 mb-1">
                Complaint Details
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                placeholder="Describe your issue in detail..."
                rows={5}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition duration-300 ${
                isSaving ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSaving && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              {isSaving ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        {/* Submitted Complaints */}
        <h2 className="text-3xl font-semibold text-purple-800 text-center mb-8">
          Submitted Complaints
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center text-purple-600 text-xl font-medium">
            <svg
              className="animate-spin h-6 w-6 mr-2 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Loading complaints...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {complains.length > 0 ? (
              complains.map((complain) => (
                <div
                  key={complain.Id}
                  className="bg-white border border-purple-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-bold text-purple-700 mb-2">
                    {complain.Title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{complain.Body}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No complaints submitted yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default App;