import { useEffect, useState } from "react";

export default function ComplaintsForm() {
   const [title, setTitle] = useState("");
   const [body, setBody] = useState("");
   const [isSaving, setIsSaving] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const baseUrl = "https://sugarytestapi.azurewebsites.net/";
   const savePath = "TestApi/SaveComplain";

   // Clear error message when title or body changes
   useEffect(() => {
      if (title && body) {
         setErrorMessage("");
      }
   }, [title, body])

   // Save a new complaint
   const handleSubmit = async () => {
      try {
         if (!title || !body) {
            setErrorMessage("Title and body are required.");
            return;
         }
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
         setTitle("");
         setBody("");
         // Missing: Update complaints list after successful submission
      } catch (e) {
         if (e instanceof Error) {
            setErrorMessage(e.message);
         } else {
            setErrorMessage("An unknown error occurred.");
         }
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className='card !border-2 border-dashed hover:!border-primary'>
         <h2 className="text-lg text-gray-300 font-bold">Submit a Complaint</h2>
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
         <button onClick={handleSubmit} className='btn' disabled={isSaving}>
            {isSaving ? 'Submitting...' : 'Submit Complaint'}
         </button>
         {errorMessage && <p className="text-red-500">{errorMessage}</p>}
         {/* Place text loader when saving */}
         {/* Error message not displayed even though state exists */}
      </div>
   )
}
