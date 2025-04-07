import { useState } from "react";
import { Complain } from "../interfaces/types/types";

function Card({ Id, Title, Body, CreatedAt }: Complain) {
  const [showFullBody, setShowFullBody] = useState(false);

  const handleBody = () => {
    setShowFullBody(!showFullBody);
  };

  return (
    <div className="complain-card">
      <div key={Id} className="complain-card-content">
        <div className="complain-header">
          <h3 className="complain-title">{Title}</h3>
        </div>
        <div className="complain-date-container">
          <p className="complain-date">
            {new Date(CreatedAt).toLocaleDateString()}
          </p>
        </div>
        {Body.length > 100 ? (
          !showFullBody ? (
            <div className="show-more">
              <p className="complain-body">{Body.slice(0, 100)}...
                <button className="showbtn" onClick={handleBody}>
                Read More
              </button>
              </p>

            </div>
          ) : (
            <div>
              <p className="complain-body">{Body}</p>
              <button className="showbtn" onClick={handleBody}>
                Read Less
              </button>
            </div>
          )
        ) : (
          <p className="complain-body">{Body}</p> // just show body normally if it's short
        )}
      </div>
    </div>
  );
}

export default Card;
