import type React from "react"
import "./ComplaintCard.css"
import { Complaint } from "../../data/types"
// import { formatRelativeTime } from "../../data/utils"


interface ComplaintCardProps {
  complaint: Complaint
  animationDelay?: number
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, animationDelay = 0 }) => {
  const { Title, Body } = complaint
  // const { Title, Body, CreatedAt } = complaint
  // const relativeTime = formatRelativeTime(CreatedAt)
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
        {/* <span className="complaint-time">{relativeTime}</span> */}
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

