'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Map, NavigationControl, Marker, GeolocateControl, Source, Layer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LocationDetails from './locationPopup';
import NavBar from './Navbar';
import Geofence from './Geofence';

export const MAPBOX_TOKEN = 'pk.eyJ1IjoidHJleXdiNyIsImEiOiJjbHdhYTVzeDAwY243MnFwcTZpZWtsMTA4In0.eM4pw4c2u-UgM0baq2IjQg';

const BarMap = ({ locations }) => {
  // Map states
  const [viewport, setViewport] = useState({
    longitude: -92.635,
    latitude: 32.529,
    zoom: 15.5,
    pitch: 30,
    bearing: 0,
  });
  const [mapStyle, setMapStyle] = useState("mapbox://styles/treywb7/cm1pmlmxs004901pb6xwm60vm");
  const [theme, setTheme] = useState('dark');

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [directionsRoute, setDirectionsRoute] = useState(null);
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);

  const mapRef = useRef();
  const geolocateControlRef = useRef();

  const [activeNavItem, setActiveNavItem] = useState('map');
  const [popupView, setPopupView] = useState('list');
  
  const [hasInitialLocation, setHasInitialLocation] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const timer = setTimeout(() => {
      if (geolocateControlRef.current) {
        geolocateControlRef.current.trigger();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMapStyle = (style) => {
    setMapStyle(style);
    setTheme(style.includes('light') ? 'light' : 'dark');
  };

  const onGeolocate = useCallback((e) => {
    //console.log('user location:', e.coords);
    const { longitude, latitude } = e.coords;
    setUserLocation({ longitude, latitude });
    if (!hasInitialLocation) {
      mapRef.current.getMap().flyTo({
        center: [longitude, latitude],
        zoom: 18
      });
      setHasInitialLocation(true);
    }
  }, [hasInitialLocation]);

  const openLocationsList = () => {
    setSelectedLocation(null);
    setPopupView('list');
    setActiveNavItem('bars');
  };

  const openLocationPopup = (location) => {
    setSelectedLocation(location);
    setDirectionsRoute(null);
    setPopupView('details');
    setActiveNavItem('bars');
  };

  const closeLocationPopup = () => {
    setSelectedLocation(null);
    setDirectionsRoute(null);
    setActiveNavItem(null);
    setPopupView('list');
  };

  const getDirections = async (destination, travelMode = 'driving') => {
    if (!userLocation) {
      alert("Please enable location services to get directions.");
      return;
    }
  
    setIsLoadingDirections(true);
    const start = `${userLocation.longitude},${userLocation.latitude}`;
    const end = `${destination.longitude},${destination.latitude}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${start};${end}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.routes && data.routes.length > 0) {
        setDirectionsRoute(data.routes[0].geometry);
        const coordinates = data.routes[0].geometry.coordinates;
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
  
        mapRef.current.getMap().fitBounds(bounds, {
          padding: 80
        });
      } else {
        alert("No route found.");
      }
    } catch (error) {
      alert("Error fetching directions. Try again.");
    } finally {
      setIsLoadingDirections(false);
    }
  };

  return (
    <div className="relative">
      <Map
        ref={mapRef}
        {...viewport}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
        onMove={(evt) => setViewport(evt.viewState)}
        style={{ width: '100%', height: 'calc(100vh - 64px)' }}
      >
        <NavigationControl position="top-left" />
        <GeolocateControl
          ref={geolocateControlRef}
          position="top-left"
          onGeolocate={onGeolocate}
          trackUserLocation={true}
          showAccuracyCircle={false}
          showUserLocation={true}
          positionOptions={{ enableHighAccuracy: true, timeout: 600 }}
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
          >
            <div onClick={() => openLocationPopup(location)} className="cursor-pointer z-10">
              <div className="flex flex-col items-center">
                <div className="text-2xl">🍺</div>
                <div className="text-xs bg-white bg-opacity-25 px-1 rounded text-center whitespace-nowrap">{location.name}</div>
              </div>
            </div>
          </Marker>
        ))}

        {directionsRoute && (
          <Source id="route" type="geojson" data={directionsRoute}>
            <Layer
              id="route"
              type="line"
              source="route"
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              paint={{
                "line-color": "#3b9ddd",
                "line-width": 8,
                "line-opacity": 0.8
              }}
            />
          </Source>
        )}
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

      <LocationDetails 
        locations={locations}
        location={selectedLocation} 
        onClose={closeLocationPopup} 
        userLocation={userLocation}
        theme={theme}
        onGetDirections={getDirections}
        isLoadingDirections={isLoadingDirections}
        isOpen={activeNavItem === 'bars'}
        onSelectLocation={openLocationPopup}
        view={popupView}
        onChangeView={setPopupView}
      />

      <NavBar 
        theme={theme} 
        activeItem={activeNavItem || 'map'}
        onItemClick={(item) => {
          setActiveNavItem(item);
          if (item === 'bars') openLocationsList();
          else if (item === 'map'){
            closeLocationPopup();
          }
        }}
      />

      <Geofence locations={locations} />
    </div>
  );
};

export default BarMap;