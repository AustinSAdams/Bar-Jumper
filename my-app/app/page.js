/* This is the home page. It will be the main display for the user. */
"use client";
import { useState } from "react";
//require('dotenv').config();
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, query} from "firebase/firestore";

console.log(process.env);

export default function Home() {
  return (
    <div>
      <p>Home Page</p>
    </div>
  );
}

console.log("Test");

/*const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGE_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} = process.env.local; */

console.log(process.env);
const firebaseConfig = {
  apiKey: "AIzaSyCx6y7OzvlE5ZcfNPjlJf2Xn2xRngrJoeo",
  authDomain: "bar-jumpers.firebaseapp.com",
  databaseURL: "DATABASE_NAME.firebaseio.com",
  projectId: "bar-jumpers",
  storageBucket: "bar-jumpers.appspot.com",
  messagingSenderId: "831688467414",
  appId: "1:831688467414:web:0b5d2f0f001ddb948dfa77",
  measurementId: "G-X12D9E9RFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const colRef = collection(db, 'users'); //reference to the 'users' collection

getDocs(colRef)    //get request to pull info from firestore db
  .then((snapshot) => {
    console.log(snapshot.docs)
  })