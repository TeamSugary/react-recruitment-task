

const Skeleton = () => {
  return (
    Array.from({ length: 5}).map((_, index) => (
        <div key={index} className="complain-item skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
        </div>
      ))
  )
}

export default Skeleton