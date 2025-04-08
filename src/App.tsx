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

    const fetchComplains = async (controller?: AbortSignal) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}${listPath}`, {
                signal: controller,
            });
            const data = await response.json();
            setComplains(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                if ((err as Error).name !== "AbortError")
                    setErrorMessage(`${err.name}: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewComplaint((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const response = await fetch(`${baseUrl}${savePath}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Title: newComplaint.title,
                    Body: newComplaint.body,
                }),
            });
            const data = await response.json();
            if (!data.Success) {
                throw new Error("Failed to save complaint.");
            } else if (data.Success) {
                fetchComplains();
                setErrorMessage("");
                setNewComplaint({ title: "", body: "" });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMessage(`${err.name}: ${err.message}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchComplains(controller.signal);
        return () => controller.abort();
    }, []);
    
    return (
        <div className="wrapper">
            <h2>Submit a Complaint</h2>

            <form className="complain-form">
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
                {errorMessage && (
                    <div>
                        <p className="error-message">{errorMessage}</p>
                    </div>
                )}
                {isSaving && (
                    <div className="loader-container">
                        <span className="loader" />
                    </div>
                )}
            </form>

            <h2>Complaints List</h2>

            {isLoading ? (
                <div className="loader-container">
                    <span className="loader" />
                </div>
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
