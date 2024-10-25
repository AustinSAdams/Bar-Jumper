import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import './locationHoursBubble.css';

// Helper functions
export const getOpenStatus = (hours, currentDay, currentTime) => {
  const todaysHours = hours[currentDay];
  if (todaysHours) {
    const { open, close } = todaysHours;
    
    if (close === "00:00") {
      return currentTime >= open || currentTime < close ? "Open Now" : "Closed";
    }

    return currentTime >= open && currentTime < close ? "Open Now" : "Closed";
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

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const updateDayOrder = (today) => {
  const todayIndex = WEEKDAYS.indexOf(today);
  return [...WEEKDAYS.slice(todayIndex), ...WEEKDAYS.slice(0, todayIndex)];
};

// component
const LocationHoursBubble = ({ location, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const todaysHours = location.hours && location.hours[currentDay];
  const isClosedToday = !todaysHours || !todaysHours.open || !todaysHours.close;
  const todaysFormattedHours = isClosedToday ? "" : `${formatTime(todaysHours.open)} - ${formatTime(todaysHours.close)}`;
  const openStatus = getOpenStatus(location.hours, currentDay, currentTime);
  const orderedDays = updateDayOrder(currentDay);

  return (
    <div className={`location-hours-bubble ${theme === 'dark' ? 'dark-mode' : ''}`}>

  <div className="bubble-header" onClick={toggleExpand}>
    <div className="header-info">
      <span className={`status-indicator ${openStatus === "Open Now" ? 'open-status' : 'closed-status'}`}>
        <Clock size={16} /> {openStatus}
      </span>
      <span className={`current-day ${theme === 'dark' ? 'dark-mode' : ''}`} >
        {currentDay}
      </span>
    </div>

    <span className={`today-hours ${theme === 'dark' ? 'dark-mode' : ''}`}>{todaysFormattedHours}</span>

    <span className={`expand-toggle ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </span>
  </div>

  {isExpanded && (
    <div className={`bubble-expanded ${theme === 'dark' ? 'dark-mode' : ''}`}>
      {orderedDays.filter(day => day !== currentDay).map(day => (
        <div key={day} className="day-hours">
          <span className={`day ${theme === 'dark' ? 'dark-mode' : ''}`}>
            {day}:
          </span>
          <span className={`hours ${theme === 'dark' ? 'dark-mode' : ''}`}>
            {location.hours[day]?.open
              ? `${formatTime(location.hours[day].open)} - ${formatTime(location.hours[day].close)}`
              : 'Closed'}
          </span>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default LocationHoursBubble;
