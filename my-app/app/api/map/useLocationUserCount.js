import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/api/firebase/firebaseConfig';

const useLocationUserCount = (locationId) => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    if (!locationId) return; // Ensure locationId is defined

    const locationRef = doc(db, 'locations', locationId);
    const unsubscribe = onSnapshot(locationRef, (doc) => {
      const data = doc.data();
      setUserCount(data?.currentUsers?.length || 0);
    });

    return unsubscribe;
  }, [locationId]);

  return userCount;
};

export default useLocationUserCount;
