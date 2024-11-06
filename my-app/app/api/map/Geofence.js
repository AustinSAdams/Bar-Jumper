import { useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import { db } from '@/app/api/firebase/firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const Geofence = (locations) => {
  const user = useUser();

  useEffect(() => {
    if (!user) return;

    const updateLocation = async (position) => {
      const userLocation = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      };

      for (const location of locations) {
        const locationRef = doc(db, 'locations', location.id);
        if (isWithinGeofence(userLocation, location)) {
          await updateDoc(locationRef, {
            currentUsers: arrayUnion(user.uid),
          });
        } else {
          await updateDoc(locationRef, {
            currentUsers: arrayRemove(user.uid),
          });
        }
      }
    };

    const handleError = (error) => {
      console.error('Error getting user location:', error);
    };

    const watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user, locations]);
};

export default Geofence;
