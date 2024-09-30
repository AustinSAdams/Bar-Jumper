/* This is the home page. It will be the main display for the user. */

"use client";
import { useState } from "react";
import MyMap from "./map.js";
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
  return (
    <div>
      <div className="map-container">
        <MyMap />
      </div>
    </div>
  );
}
