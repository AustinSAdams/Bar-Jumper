import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/app/api/firebase/firebaseConfig';
import './FavoriteButton.css';
import { Heart } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';

const FavoriteButton = ({ locationId }) => {
  const user = useUser();
  const [locationData, setLocationData] = useState({ count: 0, isFavorited: false }); // tracks locations fav count, and if the current users has it favorited 
  const [isLoading, setIsLoading] = useState(false);  // state for location click<-> database processing, stops bugs

  const fetchLocationData = async () => {
    if (!locationId) return;
    try {
      const locationRef = doc(db, 'locations', locationId); // get current selected location with document id
      const locationDoc = await getDoc(locationRef); 
      const count = locationDoc.exists() ? (locationDoc.data().favoritesCount || 0) : 0; // get fav count - 0 if none
      let isFavorited = false;
      if (user) {                                               // if user logged in- see if they favorited location
        const userFavRef = doc(db, 'userFavorites', user.uid); 
        const userFavDoc = await getDoc(userFavRef);
        if (userFavDoc.exists()) { 
          const favorites = userFavDoc.data().favoriteLocations || [];
          isFavorited = favorites.includes(locationId);
        }
      }
      setLocationData({ count, isFavorited }); // updates output with new count/favorited status
    } catch (error) {
      console.error('Error-location data:', error);
    }
  };

  useEffect(() => { // updates locations data when new user or new location selected
    fetchLocationData();
  }, [locationId, user]);

  const handleFavorite = async () => {
    if (!user) {
      alert("Please sign in to favorite this location.");
      return;
    }
    setIsLoading(true);
    
    try {
      const locationRef = doc(db, 'locations', locationId);
      const userFavRef = doc(db, 'userFavorites', user.uid);
      const userFavDoc = await getDoc(userFavRef);        // get current user favorites document

      if (!locationData.isFavorited) {        // adding/syncing favorites to location document
        await updateDoc(locationRef, {favoritesCount: locationData.count + 1}); // adds 1 to a locations favoritesCount when 'favorited' <- this is the state to use to track if a user favorites location

        if (!userFavDoc.exists()) {           // when a user favorites a doc for the first time, it will create a doc with their UID and an array with their favorited locations
          await setDoc(userFavRef, {favoriteLocations: [locationId]});

        } else {const currentFavorites = userFavDoc.data().favoriteLocations || []; // if a user has already favorited a location it will add the location to the array of their favorited locations
          await setDoc(userFavRef, {favoriteLocations: [...currentFavorites, locationId]});       // adds the location to the array of their favorited locations
        }
      } else {

        await updateDoc(locationRef, {                      // remove favorite from location document
          favoritesCount: Math.max(0, locationData.count - 1)
        });

        if (userFavDoc.exists()) {                                               // remove favorite from userfav document
          const currentFavorites = userFavDoc.data().favoriteLocations || [];   // if a user has already favorited a location it will remove the location from the array of their favorited locations
          await setDoc(userFavRef, {
            favoriteLocations: currentFavorites.filter(id => id !== locationId)  
          });
        }
      }

      await fetchLocationData();
    } catch (error) {
      console.error('Error-favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`favorite-button ${locationData.isFavorited ? 'favorited' : ''}`}
      disabled={isLoading}
    >
      <Heart size={24} /> {locationData.count}
    </button>
  );
};

export default FavoriteButton;