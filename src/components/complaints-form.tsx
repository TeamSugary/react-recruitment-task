import { useEffect, useState } from "react";
interface ComplaintsFormProps {
   refetchComplaints: () => Promise<void>
}

export default function ComplaintsForm({ refetchComplaints }: ComplaintsFormProps) {
   const [title, setTitle] = useState<string>("");
   const [body, setBody] = useState<string>("");
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [errorMessage, setErrorMessage] = useState<string>("");
   const baseUrl = "https://sugarytestapi.azurewebsites.net/";
   const savePath = "TestApi/SaveComplain";

   // Clear error message when title or body changes
   useEffect(() => {
      if (title && body) {
         setErrorMessage("");
      }
   }, [title, body])

   // Save a new complaint
   const handleSubmit = async (): Promise<void> => {
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
         // refetch complaints after saving
         refetchComplaints();
         const data = await response.json();
         if (!data.Success) throw new Error("Failed to save complaint.");
         setTitle("");
         setBody("");
         // Missing: Update complaints list after successful submission
      } catch (e) {
         setErrorMessage(
            e instanceof Error ? e.message : "An unknown error occurred"
         );
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className='card !border-2 border-dashed hover:!border-primary'>
         <h2 className="text-lg text-muted font-bold">Submit a Complaint</h2>
         <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
         />
         <textarea
            placeholder="Enter your complaint"
            value={body}
            rows={5}
            onChange={(e) => setBody(e.target.value)}
         />
         <button onClick={handleSubmit} className='btn' disabled={isSaving}>
            {isSaving ? 'Submitting...' : 'Submit Complaint'}
         </button>
         {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </div>
   )
}
