import { useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import { db } from '@/app/api/firebase/firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import * as turf from '@turf/turf';

const Geofence = ({ locations }) => {
  const user = useUser();

  useEffect(() => {
    if (!user) {
      console.log('No user found');
      return;
    }

    const updateLocation = async (position) => {
      const userLocation = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      };

      for (const location of locations) {
        const locationRef = doc(db, 'locations', location.id);
        const withinGeofence = isWithinGeofence(userLocation, location);

        if (withinGeofence) {
          await updateDoc(locationRef, {
            currentUsers: arrayUnion(user.uid),
          });
          console.log(`Added user ${user.uid} to location ${location.id}`);
        } else {
          await updateDoc(locationRef, {
            currentUsers: arrayRemove(user.uid),
          });
          console.log(`Removed user ${user.uid} from location ${location.id}`);
        }
      }
    };

    const handleError = (error) => {
      if (error.code === error.TIMEOUT) {
        console.warn("Location acquisition timed out. Retrying...");
      } else {
        console.error("Error getting user location:", error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000,
    });

    const removeUserFromLocations = async () => {
      for (const location of locations) {
        const locationRef = doc(db, 'locations', location.id);
        await updateDoc(locationRef, {
          currentUsers: arrayRemove(user.uid),
        });
        console.log(`Removed user ${user.uid} from location ${location.id} on page close/logout`);
      }
    };

    window.addEventListener("beforeunload", removeUserFromLocations);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("beforeunload", removeUserFromLocations);
      removeUserFromLocations();
    };
  }, [user, locations]);

  const isWithinGeofence = (userLocation, location) => {
    const userPoint = turf.point([userLocation.longitude, userLocation.latitude]);
    const locationPoint = turf.point([location.longitude, location.latitude]);
    const distance = turf.distance(userPoint, locationPoint, { units: 'meters' });
    const geofenceRadius = 45.72;

    return distance <= geofenceRadius;
  };

  return null;
};

export default Geofence;
