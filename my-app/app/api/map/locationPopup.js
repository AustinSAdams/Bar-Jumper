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
  const statusClass = openStatus === "Open" ? "text-green-500" : "text-red-500";
  const orderedDays = updateDayOrder(today).filter(day => day !== today);
  const distance = calculateDistance(userLocation, location);

  const dismissPopup = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={dismissPopup}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">

          <h2 className="text-2xl font-bold text-black">{location.name}</h2>
          {distance && <span className="text-sm text-gray-500 ml-2">{distance} miles away</span>}
        </div>

        <p className="mb-2 text-black"><strong>Address:</strong> {location.address || 'N/A'}</p>
        <p className="mb-2 text-black"><strong>Phone:</strong> {location.phone || 'N/A'}</p>

        <p className="mb-2 text-black">
          <strong>Hours:</strong> <span className={statusClass}>{openStatus}</span> ({today}: {todaysHours})

          <button onClick={() => setShowWeeklyHours(!showWeeklyHours)} className="ml-2">
            {showWeeklyHours ? '▲' : '▼'}
          </button>
        </p>
        {showWeeklyHours && (
          <div className="mt-2 text-black">
            {orderedDays.map((day) => (
              <p key={day}>
                <strong>{day}:</strong> {formatTime(location.hours[day].open)} - {formatTime(location.hours[day].close)}
              </p>
            ))}
          </div>
        )}

        <p className="mb-4 text-black"><strong>Description:</strong> {location.description || 'No description available.'}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
        
      </div>
    </div>,
    portalRoot
  );
};

export default LocationDetails;