import React, { useState } from 'react';


const getOpenStatus = (hours) => {
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5);
  const todayHours = hours[currentDay];

  if (todayHours) {
    const { open, close } = todayHours;
    return currentTime >= open && currentTime <= close ? "Open" : "Closed";
  }
  return "Closed";
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; 
  return `${formattedHour}:${minutes} ${ampm}`;
};

const formatWeekHours = (today) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIndex = daysOfWeek.indexOf(today);
  return [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)];
};

const LocationDetails = ({ location, onClose }) => {
  const [showWeeklyHours, setShowWeeklyHours] = useState(false);
  if (!location) return null;

  const today = new Date().toLocaleString('en-US', { weekday: 'long' });
  let todayHours = 'N/A';

  if (location.hours && location.hours[today]) {
    const openTime = formatTime(location.hours[today].open);
    const closeTime = formatTime(location.hours[today].close);
    todayHours = `${openTime} - ${closeTime}`;
  }

  const openStatus = getOpenStatus(location.hours);
  const statusClass = openStatus === "Open" ? "text-green-500" : "text-red-500";

  const toggleShowWeeklyHours = () => {
    setShowWeeklyHours(!showWeeklyHours);
  };

  const orderedDays = formatWeekHours(today).filter(day => day !== today);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-black mb-4">{location.name}</h2>
        <p className="mb-2 text-black"><strong>Address:</strong> {location.address || 'N/A'}</p>
        <p className="mb-2 text-black"><strong>Phone:</strong> {location.phone || 'N/A'}</p>
        <p className="mb-2 text-black">
          <strong>Hours:</strong> <span className={statusClass}>{openStatus}</span> ({today}: {todayHours})
          <button onClick={toggleShowWeeklyHours} className="ml-2">
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
    </div>
  );
};

export default LocationDetails;
