import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as turf from '@turf/turf';
import { Phone, X, ArrowLeft, Footprints, Car } from 'lucide-react';
import './locationPopup.css';
import LocationHoursBubble from './locationHoursBubble';
import LocationList from './locationList';
import { MAPBOX_TOKEN } from './map';
import FavoriteButton from './FavoriteButton';

const calculateDistance = (userLocation, locationCoords) => {
  if (!userLocation || !locationCoords.longitude || !locationCoords.latitude) return null;
  const from = turf.point([userLocation.longitude, userLocation.latitude]);
  const to = turf.point([locationCoords.longitude, locationCoords.latitude]);
  return turf.distance(from, to, { units: 'miles' }).toFixed(1);
};

const getTravelTimeAndMode = async (userLocation, locationCoords) => {
  const distance = calculateDistance(userLocation, locationCoords);
  const travelMode = distance <= 1 ? 'walking' : 'driving';
  
  const url = `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${userLocation.longitude},${userLocation.latitude};${locationCoords.longitude},${locationCoords.latitude}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const travelTime = data.routes[0].duration / 60; 
    return { travelTime: Math.round(travelTime), travelMode, route: data.routes[0].geometry };
  } catch (err) {
    console.error('Error fetching directions:', err);
    return { travelTime: null, travelMode, route: null };
  }
};

const LocationDetails = ({ locations, location, onClose, userLocation, theme, onGetDirections, isOpen, onSelectLocation, view, onChangeView }) => {
  const [portalRoot, setPortalRoot] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [travelMode, setTravelMode] = useState('walking');
  const [directionsRoute, setDirectionsRoute] = useState(null); 

  useEffect(() => {
    setPortalRoot(document.body);

    if (userLocation && location) {
      getTravelTimeAndMode(userLocation, location).then(({ travelTime, travelMode, route }) => {
        setTravelTime(travelTime);
        setTravelMode(travelMode);
        setDirectionsRoute(route); 
      });
    }
  }, [userLocation, location]);

  if (!portalRoot) return null;

  const dismissPopup = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleGetDirections = () => {
    if (directionsRoute) {
      onGetDirections(location, travelMode);
    }
  };

  const renderContent = () => {
    if (view === 'list') {
      return (
        <LocationList
          locations={locations}
          onSelectLocation={onSelectLocation}
          onClose={onClose}
          theme={theme}
        />
      );
    } else if (location) {
      const { phone, name, address, 'loc-profile-Image': profileImage } = location;
      const distance = calculateDistance(userLocation, location);

      return (
        <div className={`location-popup-content ${theme === 'dark' ? 'dark-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="location-popup-header">
            <button onClick={() => onChangeView('list')} className={`location-popup-arrow ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <ArrowLeft size={24} />
            </button>
            <div className="location-popup-header-left">
              {profileImage && (
                <img
                  src={profileImage}
                  alt={`${name} image`}
                  className="location-popup-image"
                />
              )}
              <div className="location-popup-details">
                <h2 className={`location-popup-title ${theme === 'dark' ? 'dark-mode' : ''}`}>{name}</h2>
                <h3 className={`location-popup-address ${theme === 'dark' ? 'dark-mode' : ''}`}>
                  {address || 'N/A'}
                  {distance && ` - ${distance} miles`}
                </h3>
                <h4 className={`location-popup-phone ${theme === 'dark' ? 'dark-mode' : ''}`}>
                  <Phone size={17} strokeWidth={3} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  <a href={`tel:${phone}`}>{phone || 'N/A'}</a>
                </h4>

                <div className="location-actions">
                  <FavoriteButton locationId={location.id} initialFavoritesCount={location.favoritesCount || 0} />
                  {travelTime !== null && (
                    <button 
                      className={`travel-info-bubble ${theme === 'dark' ? 'dark-mode' : ''}`}
                      onClick={handleGetDirections}
                      disabled={!directionsRoute}
                    >
                      {travelMode === 'walking' ? <Footprints /> : <Car />}
                      <span>{travelTime} min</span>
                    </button>
                  )}
                </div>
                
                <div className="hours-section">
                  <LocationHoursBubble location={location} theme={theme} />
                </div>
              </div>
            </div>
            <button onClick={onClose} className={`location-popup-close ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <X size={24} />
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return createPortal(
    <div className={`location-popup ${isOpen ? 'open' : ''}`} onClick={dismissPopup}>
      {renderContent()}
    </div>,
    portalRoot
  );
};

export default LocationDetails;