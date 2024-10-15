import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as turf from '@turf/turf';
import { Phone } from 'lucide-react';
import './locationPopup.css';

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

  const todaysHours = location.hours && location.hours[today] && location.hours[today].open && location.hours[today].close 
  ? `${formatTime(location.hours[today].open)} - ${formatTime(location.hours[today].close)}`
  : '';

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
  {/* Flex container for image and text (name and address) */}
  <div className="location-popup-header">
    {/* Profile Image */}
    {location['loc-profile-Image'] && (
      <img
        src={location['loc-profile-Image']}
        alt={`${location.name} profile`}
        className="location-popup-image"
      />
    )}
    {/* Flex column for name and address */}
    <div className="location-popup-details">
      <h2 className="location-popup-title">{location.name}</h2>
      <h3 className="location-popup-address">
        <strong></strong> {location.address || 'N/A'}
        {distance && <span className="location-popup-address"> - {distance} miles</span>}
      </h3>
      <h4 className="location-popup-address"> <Phone size={17} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {location.phone || 'N/A'}</h4>
    </div>
  </div>

  {/* Other Info */}
  <p className="location-popup-info">
    <strong>{today}:{todaysHours}</strong> 
    <span className={openStatus === "Open" ? "location-status-open" : "location-status-closed"}>
      {openStatus}
    </span>
    <button onClick={() => setShowWeeklyHours(!showWeeklyHours)} className="location-popup-toggle">
      {showWeeklyHours ? '▲' : '▼'}
    </button>
  </p>

  {showWeeklyHours && (
  <div className="location-popup-weekly-hours">
    {orderedDays.map((day) => {
      const dayHours = location.hours[day];
      const isClosed = !dayHours || !dayHours.open || !dayHours.close;

      return (
        <p key={day} className="location-popup-day-hours">
          <strong>{day}:</strong> 
          {isClosed ? 'Closed' : `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`}
        </p>
      );
    })}
  </div>
)}

  <button onClick={onClose} className="location-popup-close">
    Close
  </button>
</div>
    </div>,
    portalRoot
  );
};

export default LocationDetails;
