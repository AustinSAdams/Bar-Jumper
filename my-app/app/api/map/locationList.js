import React from 'react';
import { X } from 'lucide-react';
import './locationList.css';

export const renderStars = (starCount) => {
    return Array.from({ length: 5 }, (_, index) => {
      const fullStarThreshold = index + 1;
      
      if (starCount >= fullStarThreshold) {
        return <span key={index} className="star filled">★</span>;

      } else if (starCount > index && starCount < fullStarThreshold) {
        return <span key={index} className="star half">★</span>;

      } else {
        return <span key={index} className="star">★</span>;
      }
    });
  };

const LocationList = ({ locations, onSelectLocation, onClose, theme }) => {
  return (
    <div className={`location-popup-content ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="location-popup-header">

        <h2 className={`location-popup-title ${theme === 'dark' ? 'dark-mode' : ''}`}>Bar Locations</h2>

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

            <div className="location-rating">
              {renderStars(location.starCount || 0)} {/*  starCount from Firebase */}
            </div>

          </div>

        ))}


      </div>
    </div>
  );
};

export default LocationList;
