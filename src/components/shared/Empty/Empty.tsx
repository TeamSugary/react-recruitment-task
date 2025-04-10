import type React from "react"
import "./Empty.css"

interface EmptyProps {
  message: string
}

const Empty: React.FC<EmptyProps> = ({ message }) => {
  return (
    <div className="empty-container">
      <div className="empty-icon">
        <svg className="animated-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 7L12 13L21 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="empty-message">{message}</p>
    </div>
  )
}

export default Empty

