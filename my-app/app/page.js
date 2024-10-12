/* This is the home page. It will be the main display for the user. */
"use client";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import MyMap from "./api/map/map.js";
import 'mapbox-gl/dist/mapbox-gl.css';
import { getAllDocuments } from "./api/firebase/firebase.js";



export default function Home() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationDocs = await getAllDocuments('locations');
        setLocations(locationDocs);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div>
      <div className="map-container">
        <MyMap locations={locations}/>
      </div>
    </div>
  );
}