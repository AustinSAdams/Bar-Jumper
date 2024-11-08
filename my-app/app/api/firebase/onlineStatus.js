import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { auth, rtdb } from "./firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export function setUserOnlineStatus() {
  const user = auth.currentUser;
  if (!user) return;

  const userStatusFirestoreRef = doc(db, 'users', user.uid);

  const isOfflineForFirestore = {
    state: 'offline',
    last_changed: serverTimestamp(),
  };

  const isOnlineForFirestore = {
    state: 'online',
    last_changed: serverTimestamp(),
  };

  window.addEventListener('beforeunload', () => {
    updateDoc(userStatusFirestoreRef, isOfflineForFirestore);
  });

  updateDoc(userStatusFirestoreRef, isOnlineForFirestore);
}

export function setUserOfflineStatus() {
  const user = auth.currentUser;
  if (!user) return;

  const userStatusFirestoreRef = doc(db, 'users', user.uid);
  updateDoc(userStatusFirestoreRef, {
    state: 'offline',
    last_changed: serverTimestamp(),
  });
}