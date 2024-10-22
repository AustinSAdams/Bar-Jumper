import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Set up firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCx6y7OzvlE5ZcfNPjlJf2Xn2xRngrJoeo',
  authDomain: "bar-jumpers.firebaseapp.com",
  databaseURL: "DATABASE_NAME.firebaseio.com",
  projectId: "bar-jumpers",
  storageBucket: "bar-jumpers.appspot.com",
  messagingSenderId: '831688467414',
  appId: '1:831688467414:web:0b5d2f0f001ddb948dfa77',
  measurementId: "G-X12D9E9RFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };