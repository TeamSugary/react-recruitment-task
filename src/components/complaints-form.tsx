import { FormEvent, useEffect, useState } from "react";
import "../styles/complaints-form.css"

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
   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
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
      } catch (e) {
         setErrorMessage(
            e instanceof Error ? e.message : "An unknown error occurred"
         );
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <form className='card form-container' onSubmit={handleSubmit}>
         <h2 style={{ color: "rgb(var(--muted))", fontWeight: 600, fontSize: "1rem" }}>Submit a Complaint</h2>
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
         <button type="submit" className='btn' disabled={isSaving}>
            {isSaving ? 'Submitting...' : 'Submit Complaint'}
         </button>
         {errorMessage && <p className="form-error">{errorMessage}</p>}
      </form>
   )
}
