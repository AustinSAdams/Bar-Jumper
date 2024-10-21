import { useContext, useState } from 'react';
import { UserContext } from '@/app/context/UserContext';
import './FavoriteButton.css';
import { Heart } from 'lucide-react';



const FavoriteButton = ({ locationId, initialFavoritesCount }) => {
  const { currentUser } = useContext(UserContext); // gets the current signed in user 
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount);

  const handleFavorite = async () => {
    if (currentUser) {
      try {
        // Increment the favorite count in Firestore
        const locationRef = doc(db, 'locations', locationId);
        await updateDoc(locationRef, {
          favoritesCount: increment(1)
        });
        setFavoritesCount(favoritesCount + 1); // Update local state
      } catch (error) {
        console.error('Error updating favorite count: ', error);
      }
    } else {
      alert("Please sign in to favorite this location.");
    }
  };

  return (
    <button onClick={handleFavorite} className="favorite-button"> <Heart size={15}/> ({favoritesCount})
    </button>
  );
};

export default FavoriteButton;
