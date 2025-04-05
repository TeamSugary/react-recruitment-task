import React from "react"

interface ComplaintProps {
    complaintData: {
      Title: string;
      Body: string;
      Id: number; // It's good practice to include all expected properties
    };
  }


export default function Complaint({ complaintData }: ComplaintProps) {


    return (
        <div className="complain-item">
            <h3>{complaintData.Title}</h3>
            <p>{complaintData.Body}</p>
        </div>
    )
}
