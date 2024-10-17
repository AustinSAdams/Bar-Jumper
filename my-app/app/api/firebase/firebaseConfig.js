import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Set up firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCx6y7OzvlE5ZcfNPjlJf2Xn2xRngrJoeo',
  authDomain: "bar-jumpers.firebaseapp.com",
  databaseURL: "DATABASE_NAME.firebaseio.com",
  projectId: "bar-jumpers",
  storageBucket: "bar-jumpers.appspot.com",
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-X12D9E9RFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };