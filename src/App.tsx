import React, { useState, useEffect } from "react";
import { useComplainStore } from "./store/useComplainStore";

function App() {
  const {
    complains,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    fetchComplains,
    addComplain,
    clearMessages,
  } = useComplainStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    fetchComplains();
  }, [fetchComplains]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      useComplainStore.setState({
        errorMessage: "Please fill in both fields.",
      });
      return;
    }

    if (title.length > 50) {
      useComplainStore.setState({
        errorMessage: "Title must be less than 50 characters.",
      });
      return;
    }

    if (body.length > 500) {
      useComplainStore.setState({
        errorMessage: "Complaint must be less than 500 characters.",
      });
      return;
    }

    await addComplain(title, body);
    setTitle("");
    setBody("");

    setTimeout(() => {
      clearMessages();
    }, 3000);
  };

  return (
    <main className="main-container" role="main">
      <section className="form-container">
        <h2 id="complaint-heading">Submit a Complaint</h2>
        <form
          onSubmit={handleSubmit}
          className="complain-form"
          aria-labelledby="complaint-heading"
        >
          <label htmlFor="title" className="sr-only">
            Complaint Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
            aria-required="true"
          />

          <label htmlFor="body" className="sr-only">
            Complaint Details
          </label>
          <textarea
            id="body"
            placeholder="Enter your complaint"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={500}
            required
            aria-required="true"
            rows={5}
          />

<button type="submit" disabled={isSaving}>
  {isSaving ? "Submitting..." : "Submit Complaint"}
</button>


          {errorMessage && (
            <p className="error-message" role="alert">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="success-message" role="status">
              {successMessage}
            </p>
          )}
        </form>
      </section>

      <section className="complaints-list-section" aria-labelledby="complaint-list-heading">
        <h3 id="complaint-list-heading">Complaint List</h3>

        <div className="complaints-list">
          {isLoading ? (
            <p>Loading complaints...</p>
          ) : complains.length ? (
            complains.map((complain) => (
              <article key={complain.Id} className="complaint-box" aria-labelledby={`complaint-title-${complain.Id}`}>
                <h4 id={`complaint-title-${complain.Id}`} className="complaint-title">
                  {complain.Title}
                </h4>
                <p className="complaint-message">{complain.Body}</p>
              </article>
            ))
          ) : (
            <p>No complaints available.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;