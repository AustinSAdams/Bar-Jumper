/* This is the home page. It will be the main display for the user. */
"use client";
import { UsersContext } from './context/UsersContext';
import { useState, useEffect, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, query} from "firebase/firestore";
import MyMap from "./api/map/map.js";
import 'mapbox-gl/dist/mapbox-gl.css';
import { getAllDocuments } from './api/firebase/firebase';

/* MAIN PAGE */
export default function Home() {
  const [locations, setLocations] = useState([]);

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "bar-jumpers.firebaseapp.com",
    databaseURL: "DATABASE_NAME.firebaseio.com",
    projectId: "bar-jumpers",
    storageBucket: "bar-jumpers.appspot.com",
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: "G-X12D9E9RFL"
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const locationsRef = collection(db, 'locations');
      try {
        const snapshot = await getDocs(locationsRef);
        const locationData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLocations(locationData);
        console.log("Fetched locations:", locationData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);


  /* Effect used to update the locations every time the page is refreshed.
  useEffect(() => {
    async function fetchLocations(){
      try{
        const locationDocs = await getAllDocuments('users');
        setLocations(locationDocs);
      }catch (err){
        console.error("Error Fetching Locations",err);
      }
    }
    fetchLocations();
  },[]); */

  /* Effect for error handling. Prints locations upon it's update
  useEffect(()=> {
    console.log(locations);
  },[locations])
   */

  return (
    <div>
      <div className="map-container">
        <MyMap locations={locations} />
      </div>
    </div>
  );
}