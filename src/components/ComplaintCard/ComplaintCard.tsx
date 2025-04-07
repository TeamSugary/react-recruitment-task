import type React from "react"
import "./ComplaintCard.css"
import { Complaint } from "../../data/types"


interface ComplaintCardProps {
  complaint: Complaint
  animationDelay?: number
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, animationDelay = 0 }) => {
  const { Title, Body } = complaint
  const hasTitle = Boolean(Title.trim())
  const hasBody = Boolean(Body.trim())

  return (
    <div
      className="complaint-card"
      style={{
        animationDelay: `${animationDelay}s`,
      }}
    >
      <div className="complaint-card-header">
        {hasTitle ? (
          <h3 className="complaint-title">{Title}</h3>
        ) : (
          <h3 className="complaint-title missing">No Title</h3>
        )}
      </div>

      <div className="complaint-card-body">
        {hasBody ? (
          <p className="complaint-body">{Body}</p>
        ) : (
          <p className="complaint-body missing">No description provided</p>
        )}
      </div>
    </div>
  )
}

export default ComplaintCard

