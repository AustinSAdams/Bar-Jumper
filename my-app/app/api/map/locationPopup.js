import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as turf from '@turf/turf';
import { Phone } from 'lucide-react';
import './locationPopup.css';
import LocationHoursBubble from './locationHoursBubble';

// Helper Function for distance calculation
const calculateDistance = (userLocation, locationCoords) => {
  if (!userLocation || !locationCoords.longitude || !locationCoords.latitude) return null;
  const from = turf.point([userLocation.longitude, userLocation.latitude]);
  const to = turf.point([locationCoords.longitude, locationCoords.latitude]);
  return turf.distance(from, to, { units: 'miles' }).toFixed(1);
};

// Popup Component
const LocationDetails = ({ location, onClose, userLocation }) => {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  if (!location || !portalRoot) return null;
  const distance = calculateDistance(userLocation, location);

  const dismissPopup = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="location-popup-overlay" onClick={dismissPopup}>
      <div className="location-popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="location-popup-header">
          {location['loc-profile-Image'] && (
            <img
              src={location['loc-profile-Image']}
              alt={`${location.name} profile`}
              className="location-popup-image"
            />
          )}
          <div className="location-popup-details">
            <h2 className="location-popup-title">{location.name}</h2>
            <h3 className="location-popup-address">
              {location.address || 'N/A'}
              {distance && ` - ${distance} miles`}
            </h3>
            <h4 className="location-popup-address">
              <Phone size={17} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              {location.phone || 'N/A'}
            </h4>
          </div>
        </div>
        <LocationHoursBubble location={location} />

        <button onClick={onClose} className="location-popup-close">
          Close
        </button>
      </div>
    </div>,
    portalRoot
  );
};

export default LocationDetails;
