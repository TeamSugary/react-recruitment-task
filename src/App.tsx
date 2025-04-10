import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./index.css";

const API = "https://sugarytestapi.azurewebsites.net/";

type Complain = {
  Id: number;
  Title: string;
  Body: string;
};

type FormData = {
  title: string;
  body: string;
};

function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset } = useForm<FormData>();

  // Fetch complaints
  const fetchComplains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}TestApi/GetComplains`);
      setComplains(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const res = await axios.post(`${API}TestApi/SaveComplain`, {
        Title: data.title,
        Body: data.body,
      });

      if (!res.data.Success) throw new Error("Failed to save complaint");

      setSuccess("Complaint submitted!");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
      reset();
      fetchComplains();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="complaint-wrapper">
      <div className="complaint-container">
        {/* Title & Logo */}
        <div className="header">
          <img src="Adobe Express - file.png" alt="logo" className="logo" />
          <h2 className="title">Submit a Complaint</h2>
        </div>

        {/* Form */}
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              {...register("title")}
              id="title"
              placeholder="Enter your title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Your Complaint</label>
            <textarea
              {...register("body")}
              id="body"
              placeholder="Describe your complaint..."
              required
            ></textarea>
          </div>

          <button type="submit" disabled={saving} className="submit-btn">
            {saving ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Messages */}
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        {/* Complaints List */}
        <h2 className="section-title">Complaints List</h2>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : complains.length ? (
          <div className="complaints-list">
            {complains.map((c) =>
              c.Title && c.Body ? (
                <div key={c.Id} className="complaint-card">
                  <h3>{c.Title}</h3>
                  <p>{c.Body}</p>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="no-complaints">No complaints yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
