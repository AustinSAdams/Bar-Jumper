import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import './locationReviews.css';
import { db, serverTimestamp } from '@/app/api/firebase/firebaseConfig.js';
import { collection, doc, getDocs, orderBy, query, addDoc, updateDoc } from 'firebase/firestore';

const LocationReviews = ({ location, theme }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [starRating, setStarRating] = useState(0);
  const user = useUser();

  
  useEffect(() => {
    const fetchReviews = async () => { // try/await to fetch reviews from Firebase
      try {
        const reviewsRef = collection(db, 'locations', location.id, 'reviews');
        const q = query(reviewsRef, orderBy('timestamp', 'asc'));
        const reviewsSnapshot = await getDocs(q);
        
        const reviewsList = reviewsSnapshot.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter(review => review.text.trim() !== '' && review.starRating > 0); // filter out empty reviews (ignore the tempate for subcollection)

        setReviews(reviewsList);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [location.id]);

  const handleAddReview = async () => {  
    if (!user) {
      alert('Please sign in to add a review');
      return;
    }

    
    if (!newReview.trim() || starRating === 0) {  // check for empty review or no star rating
      alert('Review must contain text and star rating.');
      return;
    }

    const review = {
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      text: newReview.trim(),
      starRating,
      timestamp: serverTimestamp(), // serverTimestamp formatted from Firebase
    };

    try {
      const reviewsRef = collection(db, 'locations', location.id, 'reviews');
      await addDoc(reviewsRef, review);

      setReviews([...reviews, { ...review, timestamp: new Date() }]);
      setNewReview('');
      setStarRating(0);

      
      const totalStars = [...reviews, review].reduce((acc, curr) => acc + curr.starRating, 0); // calculate locations star sum
      const newStarCount = totalStars / (reviews.length + 1);                             // calculate the new average star rating for location
      
      const locationRef = doc(db, 'locations', location.id);
      await updateDoc(locationRef, { starCount: newStarCount });
    } catch (error) {
      console.error('Reivew Submission Error:', error);
    }
  };

  const handleStarClick = (rating) => {  // set the star rating when clicked
    setStarRating(rating);
  };

  return (
    <div className={`location-reviews ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {reviews.map((review, index) => (
        <div key={index} className="review">
          <div className="review-header">
            <span className="review-username">{review.username}</span>
            <span className="review-timestamp">
              {new Date(review.timestamp.toDate ? review.timestamp.toDate() : review.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="review-text">{review.text}</div>
          <div className="review-stars">
            
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`star ${i < review.starRating ? 'filled' : ''}`}>★</span>
            ))}
          </div>
        </div>
      ))}
      
      <div className="add-review">
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Add your review..."
          disabled={!user}
        />
        <div className="star-rating-input">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`star ${i < starRating ? 'filled' : ''}`}
              onClick={() => handleStarClick(i + 1)}
            >
              ★
            </span>
          ))}
        </div>
        
        <button onClick={handleAddReview} disabled={!user || !newReview.trim() || starRating === 0}>
          Add Review
        </button>

      </div>
    </div>
  );
};

export default LocationReviews;
