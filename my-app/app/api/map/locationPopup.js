import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as turf from '@turf/turf';

// Helper Functions

const getOpenStatus = (hours, currentDay, currentTime) => {
  const todaysHours = hours[currentDay];
  if (todaysHours) {
    const { open, close } = todaysHours;
    if (close === "00:00") {
      return currentTime >= open || currentTime < close ? "Open" : "Closed"; // "..? if / else"
    }
    return currentTime >= open && currentTime < close ? "Open" : "Closed"; 
  }
  return " ";
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const updateDayOrder = (today) => {
  const todayIndex = WEEKDAYS.indexOf(today);
  return [...WEEKDAYS.slice(todayIndex), ...WEEKDAYS.slice(0, todayIndex)];
};

const calculateDistance = (userLocation, locationCoords) => {
  if (!userLocation || !locationCoords.longitude || !locationCoords.latitude) return null;
  const from = turf.point([userLocation.longitude, userLocation.latitude]); // users location
  const to = turf.point([locationCoords.longitude, locationCoords.latitude]); // targeted location (a bar)
  return turf.distance(from, to, {units: 'miles'}).toFixed(1);
};



// Popup Component

const LocationDetails = ({ location, onClose, userLocation }) => {
  const [showWeeklyHours, setShowWeeklyHours] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  if (!location || !portalRoot) return null;
  const now = new Date();
  const today = now.toLocaleString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5);

  const todaysHours = location.hours && location.hours[today] 
    ? `${formatTime(location.hours[today].open)} - ${formatTime(location.hours[today].close)}`
    : 'N/A';

  const openStatus = getOpenStatus(location.hours, today, currentTime);
  const statusClass = openStatus === "Open" ? "location-status-open" : "location-status-closed";
  const orderedDays = updateDayOrder(today).filter(day => day !== today);
  const distance = calculateDistance(userLocation, location);

  const dismissPopup = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="location-popup-overlay" onClick={dismissPopup}>
      <div className="location-popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="location-popup-header">
          <h2 className="location-popup-title">{location.name}</h2>
          {distance && <span className="location-popup-distance">{distance} miles away</span>}
        </div>

        <p className="location-popup-info"><strong>Address:</strong> {location.address || 'N/A'}</p>
        <p className="location-popup-info"><strong>Phone:</strong> {location.phone || 'N/A'}</p>

        <p className="location-popup-info">
          <strong>Hours:</strong> <span className={statusClass}>{openStatus}</span> ({today}: {todaysHours})
          <button onClick={() => setShowWeeklyHours(!showWeeklyHours)} className="location-popup-toggle">
            {showWeeklyHours ? '▲' : '▼'}
          </button>
        </p>
        {showWeeklyHours && (
          <div className="location-popup-weekly-hours">
            {orderedDays.map((day) => (
              <p key={day} className="location-popup-day-hours">
                <strong>{day}:</strong> {formatTime(location.hours[day].open)} - {formatTime(location.hours[day].close)}
              </p>
            ))}
          </div>
        )}

        <p className="location-popup-info"><strong>Description:</strong> {location.description || 'No description available.'}</p>
        <button onClick={onClose} className="location-popup-close">
          Close
        </button>
      </div>
    </div>,
    portalRoot
  );
};

export default LocationDetails;