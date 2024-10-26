import React, { useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import './locationReviews.css';

const LocationReviews = ({ location, theme }) => {
  const [reviews, setReviews] = useState(location.reviews || []);
  const [newReview, setNewReview] = useState('');
  const user = useUser();

  const handleAddReview = () => {
    if (!user) {
      alert('Please sign in to add a review');
      return;
    }

    const review = {
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      text: newReview,
      timestamp: Date.now(),
    };

    setReviews([...reviews, review]);
    setNewReview('');
  };

  return (
    <div className={`location-reviews ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {reviews.map((review, index) => (
        <div key={index} className="review">
          <div className="review-header">
            <span className="review-username">{review.username}</span>
            <span className="review-timestamp">{new Date(review.timestamp).toLocaleString()}</span>
          </div>
          <div className="review-text">{review.text}</div>
        </div>
      ))}
      <div className="add-review">
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Add your review..."
          disabled={!user}
        />
        <button onClick={handleAddReview} disabled={!user || !newReview.trim()}>
          Add Review
        </button>
      </div>
    </div>
  );
};

export default LocationReviews;