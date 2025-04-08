
import { useState, useEffect } from "react";

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  // CreatedAt?: string | number | Date;
  CreatedAt: string;
  Status?: 'Pending' | 'In Progress' | 'Resolved';
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [errorList, setErrorList] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const complaintsPerPage = 5;

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    setErrorList("");

    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch (e) {
      setErrorList(e instanceof Error ? e.message : 'Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
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
      if (!response.ok) throw new Error('Failed to save complaint');

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      setTitle("");
      setBody("");
      await fetchComplains();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit complaint");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // format the date
  const formatDateTime = (input: string | number | Date) => {
    if (!input) return "Today";

    const date = new Date(input);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // search 
  const filteredComplaints = complains.filter((complain) =>
    complain.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complain.Body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // pagination 
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);


  useEffect(() => {
    fetchComplains();
  }, []);


  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        minWidth: "98.93vw",
        background: "linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: '0 auto'
      }}
    >
      {/* submit complain part  */}
      <div style={{
        width: "45%",
      }}
      >
        <h2 style={{ marginBottom: "1rem", textAlign: "left" }}>Submit a Complaint</h2>

        <div
          style={{
            padding: "1rem",
            borderRadius: "1.5rem",
            // maxWidth: "40%",
            width: "100%",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#fff3",
            color: "#fff",
          }}
        >
          <form onSubmit={handleSubmit}>
            <style>
              {`
                  .custom-input::placeholder {
                    color: white;
                  }
                `}
            </style>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "96%",
                padding: '0.75rem',
                marginBottom: "0.8rem",
                borderRadius: "2rem",
                border: "1px solid  hsla(0,0%,100%,.3)",
                backgroundColor: "#fff3",
                color: "#fff",
                fontSize: "1rem",
                resize: 'vertical' as const,
              }}
              className="custom-input"
            />

            <textarea
              placeholder="Enter your complaint"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              style={{
                width: "96%",
                padding: '0.75rem',
                marginBottom: "0.5rem",
                borderRadius: "2rem",
                border: "1px solid  hsla(0,0%,100%,.3)",
                // outline: "none",
                backgroundColor: "#fff3",
                color: "#fff",
                fontSize: "1.1rem",
                minHeight: "5rem",
                resize: "vertical",
              }}
              className="custom-input"
            />

            <button
              onClick={handleSubmit}
              // disabled={isSaving || !title.trim() || !body.trim()}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "2rem",
                border: "none",
                // background: "linear-gradient(to right, #f953c6, #b91d73)",
                background: "linear-gradient(135deg, #ff5f6d, #ffc371)",
                color: "#fff",
                fontWeight: "bold",
                // cursor: "pointer",
                cursor: isSaving ? "not-allowed" : "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={(e) => {
                // if (!isSaving) {
                e.currentTarget.style.transform = "translateY(-0.2rem)";
                e.currentTarget.style.boxShadow = "0 1px 2px 0px white";
                // }
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {isSaving && (
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "3px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}
                />
              )}
              {isSaving ? "Submitting..." : "Submit Complaint"}
            </button>

            <style>
              {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
            </style>

            {error && (
              <p style={{ color: "#ff9999", marginTop: "10px", justifySelf: "center" }}>{error}</p>
            )}
            {success && (
              <p style={{ color: "green", marginTop: "10px", justifySelf: "center" }}>{success}</p>
            )}
          </form>
        </div>
      </div>

      {/* list part  */}
      <div style={{ marginTop: "1rem", width: "45%" }}>
        <h2>Complaints List</h2>

        <input
          type="text"
          placeholder="Search complains..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "1rem",
            border: "1px solid hsla(0,0%,100%,.3)",
            backgroundColor: "#fff3",
            color: "#fff",
            marginBottom: "1rem",
          }}
          className="custom-input"
        />


        {isLoading ?
          <div style={{ justifySelf: "center", fontSize: "1.3rem" }}>Loading...</div>
          :
          errorList ?
            <div>
              <p style={{ color: "red", justifySelf: "center" }}>{errorList}</p>
            </div>
            :
            complains.length ?
              <div
                style={{
                  display: 'grid',
                  // gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gridTemplateColumns: "auto",
                  gap: '0rem',
                  // marginTop: '0.5rem'
                }}
              >
                {currentComplaints.map((complain) => (
                  <div
                    key={complain.Id}
                    style={{
                      background: "#fff3",
                      border: "1px solid  hsla(0,0%,100%,.3)",
                      borderRadius: "1.5rem",
                      // boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                      boxShadow: "0 4px 10px #0003",
                      padding: "1rem",
                      margin: "10px 0",
                      width: "100%",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-0.2rem)"; e.currentTarget.style.boxShadow = "0 4px 10px #0006"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, wordBreak: "break-word" }}>{complain?.Title}</h3>
                      <span style={{ fontSize: '0.8rem', }}># {complain?.Id}</span>
                    </div>

                    <p style={{ wordBreak: "break-word" }}>{complain?.Body}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{}}>
                        {complain?.Status || 'Pending'}
                      </span>

                      <span style={{ fontSize: '0.8rem', }}>
                        {formatDateTime(complain?.CreatedAt)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* // pagination  */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "0.5rem" }}>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        border: "none",
                        backgroundColor: currentPage === 1 ? "#fff1" : "#fff3",
                        color: "#fff",
                        // cursor: "pointer"
                      }}
                    >
                      Prev
                    </button>

                    <span style={{ alignSelf: "center" }}>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        border: "none",
                        backgroundColor: currentPage === totalPages ? "#fff1" : "#fff3",
                        color: "#fff",
                        // cursor: "pointer"
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}

              </div>
              :
              <p>No complaints available.</p>
        }
      </div>
    </div >
  );
}

export default App;
