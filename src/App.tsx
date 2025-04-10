import React from 'react';
import './App.css';

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

const CircleLoader = () => (
  <div className="circle-loader">
    <div className="circle"></div>
  </div>
);

function App() {
  const [complains, setComplains] = React.useState<Complain[]>([]);
  const [title, setTitle] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [expandedIds, setExpandedIds] = React.useState<number[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState<boolean>(false);

  const [optimisticComplains] = React.useOptimistic<Complain[], Complain>(
    complains,
    (prev, newItem) => [...prev, newItem]
  );

  const fetchComplains = async (controller?: AbortController) => {

    setErrorMessage("");

    try {
      const response = await fetch(`${baseUrl}${listPath}`, {
        signal: controller?.signal,
      });

      if (!response.ok) throw new Error("Failed to fetch complaints.");
      const data: Complain[] = await response.json();
      startTransition(() => {
        setComplains(data);
      });

    } catch (err: any) {
      if (err.name !== "AbortError") {
        setErrorMessage(err.message || "Error fetching complaints.");
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!title.trim() || !body.trim()) {
      setErrorMessage("Both title and complaint body are required.");
      return;
    }

    const newComplain: Complain = {
      Id: Date.now(),
      Title: title.trim(),
      Body: body.trim(),
    };

    setComplains((prev) => [newComplain, ...prev]);
    setTitle("");
    setBody("");

    try {
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title: newComplain.Title, Body: newComplain.Body }),
      });

      const data = await response.json();
      if (!data?.Success) throw new Error("Failed to submit complaint.");

    } catch (e: any) {
      setComplains((prev) => prev.filter(c => c.Id !== newComplain.Id));
      setErrorMessage(e.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const controller = new AbortController();
    fetchComplains(controller);
    return () => controller.abort();
  }, []);

  const handleSeeMore = (id: number) => {
    setExpandedIds((prev) => [...prev, id]);
  };

  return (
    <div className="wrapper">
      <h2>Submit a Complaint</h2>

      <div className="complain-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Complaint title"
        />
        <textarea
          placeholder="Enter your complaint"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          aria-label="Complaint body"
        />
        <button onClick={handleSubmit} disabled={loading}>
          Submit Complaint
          {loading && <CircleLoader />}
        </button>

        {errorMessage && <p>{errorMessage}</p>}
      </div>

      <div className="complain-list">
        <h2>Complaints List</h2>
        {isPending ? (
          <p>Loading complaints...</p>
        ) : optimisticComplains.length ? (
          optimisticComplains.map((complain) => {
            const isExpanded = expandedIds.includes(complain.Id);
            const isLong = complain.Body.length > 150;
            const displayText = isExpanded
              ? complain.Body
              : complain.Body.slice(0, 150);

            return (
              <div key={complain.Id} className="complain-item">
                <h3>{complain.Title}</h3>
                <p>
                  {displayText}
                  {isLong && !isExpanded && '... '}
                  {isLong && !isExpanded && (
                    <button onClick={() => handleSeeMore(complain.Id)}>
                      See more
                    </button>
                  )}
                </p>
              </div>
            );
          })
        ) : (
          <p>No complaints available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
