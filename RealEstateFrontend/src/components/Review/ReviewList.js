import React, { useState, useEffect } from 'react';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error("Error fetching reviews:", error));
  }, []);

  return (
    <div>
      <h2>Danh sách đánh giá</h2>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            Bất động sản ID: {review.propertyId}, Điểm: {review.rating}, Nhận xét: {review.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
