import { useState } from "react";

interface ComplainDataProps {
  title: string;
  description: string;
}

function ComplaintForm() {
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

  return (
    <div className="container">
      <div className="form-heading">
        <div className="round"></div>
        <div className="line"></div>
        <h2 className="heading">Submit a Complaint</h2>
        <div className="line"></div>
        <div className="round"></div>
      </div>

      <div>
        <form className="complain-form">
          <input
            className="input"
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

          <button type="submit">
            {isSaving ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;
