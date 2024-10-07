'use client';

import React, { useState } from 'react';
import { Map, NavigationControl } from 'react-map-gl';

const barMap = () => {
  const [viewport, setViewport] = useState({
    longitude: -92.635,
    latitude: 32.529,  
    zoom: 15.5,
    pitch: 30,
    bearing: 0,
  });

  const [mapStyle, setMapStyle] = useState("mapbox://styles/treywb7/cm1pmlmxs004901pb6xwm60vm");

  const toggleMapStyle = (style) => {
    setMapStyle(style);
  };

  return (
    <div className="relative">
      <Map
        {...viewport}
        mapboxAccessToken='pk.eyJ1IjoidHJleXdiNyIsImEiOiJjbHdhYTVzeDAwY243MnFwcTZpZWtsMTA4In0.eM4pw4c2u-UgM0baq2IjQg'
        mapStyle={mapStyle}
        onMove={(evt) => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100vh' }}
      >
        <NavigationControl position="top-left" />
      </Map>
      <div className="absolute top-4 right-4 flex gap-2"> 
        <button 
          onClick={() => toggleMapStyle("mapbox://styles/mapbox/light-v10")}
          className="w-8 h-8 bg-white rounded-full text-black flex items-center justify-center shadow-md hover:bg-gray-200 transition-colors"
        >
          ☀️
        </button>
        <button 
          onClick={() => toggleMapStyle("mapbox://styles/treywb7/cm1pmlmxs004901pb6xwm60vm")}
          className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors"
        >
          🌙
        </button>
      </div>
    </div>
  );
};

export default barMap;