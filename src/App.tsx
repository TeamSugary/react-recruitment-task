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

interface NewComplaint {
    title: string;
    body: string;
}

function App() {
    const [complains, setComplains] = useState<Complaint[]>([]);
    const [newComplaint, setNewComplaint] = useState<NewComplaint>({
        title: "",
        body: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Fetch complaints from the API
    const fetchComplains = async (controller: AbortSignal) => {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}${listPath}`, {
            signal: controller,
        });
        const data = await response.json();
        setComplains(data);
        setIsLoading(false);
    };

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewComplaint((prev) => ({ ...prev, [name]: value }));
    };

    // Save a new complaint
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        const controller = new AbortController();
        fetchComplains(controller.signal);
        return () => controller.abort();
    }, []); // Missing dependency array cleanup

    return (
        <div className="wrapper">
            <h2>Submit a Complaint</h2>

            <form className="complain-form">
                <label htmlFor="title"></label>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={newComplaint?.title}
                    onChange={handleInput}
                />
                <textarea
                    placeholder="Enter your complaint"
                    name="body"
                    value={newComplaint?.body}
                    onChange={handleInput}
                />

                <button onClick={handleSubmit}>
                    {isSaving ? "Submitting..." : "Submit Complaint"}
                </button>

                {/* Place text loader when saving */}
                {/* Error message not displayed even though state exists */}
            </form>

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
