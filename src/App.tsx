/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import "./App.css";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

interface Complaint {
    Id: number;
    Title: string;
    Body: string;
    CreatedAt: string;
}

function App() {
    const [complains, setComplains] = useState<Complaint[]>([]);
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

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
            setIsSaving(true);
            const response = await fetch(savePath, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Title: "Test Title",
                    Body: "Test Body",
                }),
            });
            const data = await response.json();
            if (!data.Success) throw new Error("Failed to save complaint.");
            // Missing: Update complaints list after successful submission
        } catch (e) {
            // Error state not being set
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchComplains();
    }, []); // Missing dependency array cleanup

    return (
        <div className="wrapper">
            <h2>Submit a Complaint</h2>

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
                    {isSaving ? "Submitting..." : "Submit Complaint"}
                </button>

                {/* Place text loader when saving */}
                {/* Error message not displayed even though state exists */}
            </div>

            <h2>Complaints List</h2>

            {isLoading ? (
                <div>Loading...</div>
            ) : complains.length ? (
                complains.map((complain) => (
                    <div key={complain.Id} className="complain-item">
                        <h3>{complain.Title}</h3>
                        <p>{complain.Body}</p>
                    </div>
                ))
            ) : (
                <p>No complaints available.</p>
            )}
        </div>
    );
}

export default App;
