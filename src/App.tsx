import { useState, useEffect } from "react";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

function App() {
  const [complains, setComplains] = useState<
    { Id: number; Title: string; Body: string }[]
  >([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSucessMessage] = useState("");
  const [scrollRatio, setScrollRatio] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter complaints based on search query
  const filteredComplaints = complains.filter((complaint) =>
    complaint.Title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    complaint.Body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Failed to fetch complaints.");
    }
  };

  // Save a new complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    console.log("Submitting:", title, body);

    try {
      setIsSaving(true);
      setErrorMessage("");

      const response = await fetch(`${baseUrl}/${savePath}`, {
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
      if (data?.Success) {
        setSucessMessage("Complaint added successfully.");
        setTitle("");
        setBody("");
      } else {
        throw new Error();
      }
      if (!data?.Success) {
        throw new Error("Failed to save complaint.");
      }

      // Reset form fields after successful submission
      setTitle("");
      setBody("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  const interpolateColor = (start: string, end: string, ratio: number) => {
    const hexToRgb = (hex: string) =>
      hex.match(/.{2}/g)!.map((x) => parseInt(x, 16));
    const rgbToHex = (rgb: number[]) =>
      "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("");

    const startRgb = hexToRgb(start.replace("#", ""));
    const endRgb = hexToRgb(end.replace("#", ""));

    const interpolated = startRgb.map((s, i) =>
      Math.round(s + (endRgb[i] - s) * ratio)
    );
    return rgbToHex(interpolated as number[]);
  };

  useEffect(() => {
    const data = fetchComplains();
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = window.scrollY / maxScroll;
      setScrollRatio(Math.min(1, Math.max(0, ratio))); // Clamp between 0 and 1
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftColor = interpolateColor("#76de3d", "#0f284a", scrollRatio);
  const rightColor = interpolateColor("#348491", "#317c8e", scrollRatio);

  console.log(complains);
  return (
    <div
      className="wrapper"
      style={{
        background: `linear-gradient(to right, ${leftColor} ${
          scrollRatio * 100
        }%, ${rightColor} ${scrollRatio * 100}%)`,
        transition: "background 0.3s ease",
        color: scrollRatio < 0.5 ? "white" : rightColor,
      }}
    >
      <div className="inner-wrapper">
        {successMessage && (
          <p
            style={{
              color: "green",
              fontSize: "20px",
              position: "relative",
              top: 0,
              left: "30%",
            }}
          >
            {successMessage}
          </p>
        )}
        <form
          className="complain-form"
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
         
           
            gap: 20,
        
          }}
        >
          <h2>Submit a Complaint</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            required
            style={{
              padding: 20,
              border: "2px solid white",
              borderRadius: 10,
              color: "white",
            }}
          />

          <textarea
            placeholder="Enter your complaint"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            name="body"
            rows={5}
            required
            style={{
              padding: 20,
              border: "2px solid white",
              borderRadius: 10,
            }}
          />

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Submitting..." : "Submit Complaint"}
          </button>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>

        <div>
          <div
            className="inner-wrapper"
            style={{
              padding: 20,
              maxWidth: "60%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h2>Complaints List</h2>
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                padding: "5px 10px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : filteredComplaints.length ? (
            filteredComplaints
              .sort((a, b) => b.Id - a.Id)
              .slice(0, 20)
              .map((complain) => (
                <div
                  key={complain.Id}
                  className="complain-item complain-form inner-wrapper"
                  style={{ margin: "0 auto", marginTop: 10 }}
                >
                  <h3>{complain.Title.slice(0, 10)}</h3>
                  <p>{complain.Body.slice(0, 50)}</p>
                </div>
              ))
          ) : (
            <p>No complaints available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
