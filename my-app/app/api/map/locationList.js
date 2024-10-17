// LocationList.js
import React from 'react';
import { X } from 'lucide-react';
import './locationList.css';

const LocationList = ({ locations, onSelectLocation, onClose, theme }) => {
  return (
    <div className={`location-popup-content ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="location-popup-header">
        <h2 className={`location-popup-title ${theme === 'dark' ? 'dark-mode' : ''}`}>All Locations</h2>
        <button onClick={onClose} className={`location-popup-close ${theme === 'dark' ? 'dark-mode' : ''}`}>
          <X size={24} />
        </button>
      </div>
      <div className="location-list">
        {locations.map(location => (
          <div 
            key={location.id} 
            className={`location-list-item ${theme === 'dark' ? 'dark-mode' : ''}`}
            onClick={() => onSelectLocation(location)}
          >
            <h3>{location.name}</h3>
            <p>{location.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;