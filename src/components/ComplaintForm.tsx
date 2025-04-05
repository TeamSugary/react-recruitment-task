import { Dispatch, SetStateAction, useState } from "react";
import { baseUrl, savePath } from "../consts/api";

export default function ComplaintForm({ isSaving,setIsSaving }: { isSaving: boolean,setIsSaving: Dispatch<SetStateAction<boolean>> }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Save a new complaint
    const handleSubmit = async () => {
        if (!body && !title) {
            setErrorMessage("Please provide title and description.");
            throw new Error("Please provide title and description.")
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

            await response.json();

            setIsSaving(false);
            setBody("");
            setTitle("");
            setErrorMessage("");
        } catch (error: any) {
            setErrorMessage("Failed to save complaint.");
            throw new Error("Failed to save complaint.");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="complain-form">
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

            <button onClick={handleSubmit}>
                {isSaving ? 'Submitting...' : 'Submit Complaint'}
            </button>
            {/* Error message */}
            {errorMessage && <p style={{ color: "#ff5858" }}>{errorMessage}</p>}
        </div>
    )
}
