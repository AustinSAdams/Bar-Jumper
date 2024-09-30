'use client';

import React, { useState } from 'react';
import { Map, NavigationControl } from 'react-map-gl';

const MyMap = () => {
  const [viewport, setViewport] = useState({
    longitude: -92.64706187658787, 
    latitude: 32.52740481253574,  
    zoom: 16,
    pitch: 30,
    bearing: 0,
  });

  return (
    <Map
      {...viewport}
      mapboxAccessToken='pk.eyJ1IjoidHJleXdiNyIsImEiOiJjbHdhYTVzeDAwY243MnFwcTZpZWtsMTA4In0.eM4pw4c2u-UgM0baq2IjQg'
      mapStyle="mapbox://styles/treywb7/clwbf10d700pz01ql7ccofyj0"
      onMove={(evt) => setViewport(evt.viewState)}
      style={{ width: '100%', height: '100vh' }}
    >
      <NavigationControl position="top-left" />
    </Map>
  );
};

export default MyMap;
