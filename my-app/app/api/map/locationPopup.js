import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as turf from '@turf/turf';
import { Phone, X, Navigation } from 'lucide-react';
import './locationPopup.css';
import LocationHoursBubble from './locationHoursBubble';

const calculateDistance = (userLocation, locationCoords) => {
  if (!userLocation || !locationCoords.longitude || !locationCoords.latitude) return null;
  const from = turf.point([userLocation.longitude, userLocation.latitude]);
  const to = turf.point([locationCoords.longitude, locationCoords.latitude]);
  return turf.distance(from, to, { units: 'miles' }).toFixed(1);
};

const LocationDetails = ({ location, onClose, userLocation, theme, onGetDirections, isLoadingDirections, isOpen }) => {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  if (!location || !portalRoot) return null;

  const { phone, name, address, 'loc-profile-Image': profileImage } = location;
  
  const distance = calculateDistance(userLocation, location);

  const dismissPopup = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleGetDirections = () => {
    onGetDirections(location);
  };

  return createPortal(
    <div className={`location-popup ${isOpen ? 'open' : ''}`} onClick={dismissPopup}>
      <div className={`location-popup-content ${theme === 'dark' ? 'dark-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="location-popup-header">
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
            </div>
          </div>
          <button onClick={onClose} className={`location-popup-close ${theme === 'dark' ? 'dark-mode' : ''}`}>
            <X size={24} />
          </button>
        </div>
        <LocationHoursBubble location={location} theme={theme} />
        <button
          onClick={handleGetDirections}
          className={`location-popup-directions ${theme === 'dark' ? 'dark-mode' : ''}`}
          disabled={isLoadingDirections}
        >
          <Navigation size={17} strokeWidth={3} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          {isLoadingDirections ? 'Loading...' : 'Directions'}
        </button>
      </div>
    </div>,
    portalRoot
  );
};

export default LocationDetails;