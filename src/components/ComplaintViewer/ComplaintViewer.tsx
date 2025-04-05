import React, { useState } from "react";

interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

interface ComplaintViewerProps {
  complains: Complain[];
}

const ITEMS_PER_PAGE = 8;

const ComplaintViewer: React.FC<ComplaintViewerProps> = ({ complains }) => {
  const [visiblePage, setVisiblePage] = useState(1);

  const paginatedComplains = complains.slice(0, visiblePage * ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setVisiblePage((prev) => prev + 1);
  };

  const hasMore = paginatedComplains.length < complains.length;

  return (
    <div className="viewer-container">
      <div className="title-heading">
        <div className="round"></div>
        <div className="line"></div>
        <h2 className="heading">Complaints List</h2>
        <div className="line"></div>
        <div className="round"></div>
      </div>

      <div className="complain-grid">
        {paginatedComplains.map((complain) => (
          <div className="complain-card" key={complain.Id}>
            <h3 className="complain-title">{complain.Title}</h3>
            <p className="complain-body">{complain.Body}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more-wrapper">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintViewer;
