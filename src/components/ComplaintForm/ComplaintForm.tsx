/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { baseUrl, savePath } from "../../App";
import toast from "react-hot-toast";

interface ComplainDataProps {
  title: string;
  description: string;
}

function ComplaintForm({ fetchComplains }: { fetchComplains: () => void }) {
  const [complainData, setComplainData] = useState<ComplainDataProps>({
    title: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setComplainData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save a new complaint
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!complainData.title) {
      toast.error("Title is required!");
      return;
    } else if (!complainData.description) {
      toast.error("Description is required!");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: complainData.title,
          Body: complainData.description,
        }),
      });
      const data = await response.json();
      if (data.Success) {
        toast.success("Complain registered successfully!");
        fetchComplains();
        setComplainData({
          title: "",
          description: "",
        });
      }
    } catch (error: any) {
      toast.error(error?.Message || "Failed to save complaint!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="form-container">
      <div className="title-heading">
        <div className="round"></div>
        <div className="line"></div>
        <h2 className="heading">Submit a Complaint</h2>
        <div className="line"></div>
        <div className="round"></div>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="complain-form">
          <input
            className="form-input"
            type="text"
            name="title"
            placeholder="Complaint Title"
            value={complainData.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Complaint Details"
            value={complainData.description}
            onChange={handleChange}
            rows={5}
          />

          <button className="form-btn" type="submit" disabled={isSaving}>
            {isSaving ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;
