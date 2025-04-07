import Card from "./Card"

function ComplaintsList({isLoading, complains}: {isLoading: boolean, complains: any[]}) {
  // console.log(complains)
  return (
    <div className="complaint-list-container">
         <div className="complaints-list">
        <h2 className="complaints-title">Recent Complaints</h2>

        {isLoading ? (
          <div className="loading-center">
            <div className="loading-spinner"></div>
            {/* <p>Loading..........</p> */}
          </div>
        ) : complains.length ? (
          <div className="complaints-cards">
            {complains.map((complain) => (
              <Card
                key={complain.Id}
                Id={complain.Id}
                Title={complain.Title}
                Body={complain.Body}
                CreatedAt={complain.CreatedAt}
              />
            ))}
          </div>
        ) : (
          <div className="no-complaints">
            <svg
              className="no-complaints-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="no-complaints-title">No complaints</h3>
            <p className="no-complaints-description">
              Be the first to submit a complaint.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComplaintsList