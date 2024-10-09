'use client';

import React, { useState, useCallback } from 'react';
import { Map, NavigationControl, Marker, GeolocateControl } from 'react-map-gl';
import LocationDetails from './locationPopup';

const barMap = ({locations}) => {
  const [viewport, setViewport] = useState({
    longitude: -92.635,
    latitude: 32.529,  
    zoom: 15.5,
    pitch: 30,
    bearing: 0,
  });

  const [mapStyle, setMapStyle] = useState("mapbox://styles/treywb7/cm1pmlmxs004901pb6xwm60vm");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const toggleMapStyle = (style) => {
    setMapStyle(style);
  };

  const onGeolocate = useCallback((e) => {
    console.log('Current position:', e.coords);
  }, []);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleCloseDetails = () => {
    setSelectedLocation(null);
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
        <GeolocateControl position="top-left" onGeolocate={onGeolocate} showUserLocation />
        {locations.map((location) => (
          <Marker 
            key={location.id}
            longitude={location.longitude} 
            latitude={location.latitude}
          >
            <div onClick={() => handleMarkerClick(location)} className="cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="text-2xl">🍺</div>
                <div className="text-xs bg-white bg-opacity-25 px-1 rounded text-center whitespace-nowrap">{location.name}</div>
            </div>
          </div>
          </Marker>
        ))}

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
      <LocationDetails location={selectedLocation} onClose={handleCloseDetails} />
    </div>
  );
};

export default barMap;