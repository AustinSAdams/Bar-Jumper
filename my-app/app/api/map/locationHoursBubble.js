import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import './locationHoursBubble.css';


// helper funcs
const getOpenStatus = (hours, currentDay, currentTime) => {
  const todaysHours = hours[currentDay];
  if (todaysHours) {
    const { open, close } = todaysHours;
    if (close === "00:00") {
      return currentTime >= open || currentTime < close ? "Open" : "Closed";
    }
    return currentTime >= open && currentTime < close ? "Open" : "Closed";
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
const LocationHoursBubble = ({ location }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const todaysHours = location.hours && location.hours[currentDay];
  const isClosedToday = !todaysHours || !todaysHours.open || !todaysHours.close;

const todaysFormattedHours = isClosedToday 
  ? "" 
  : `${formatTime(todaysHours.open)} - ${formatTime(todaysHours.close)}`;


  const openStatus = getOpenStatus(location.hours, currentDay, currentTime);
  const orderedDays = updateDayOrder(currentDay);

  return (
    <div className="location-hours-bubble">
      <div className="bubble-header" onClick={toggleExpand}>
        <span className={`status-indicator ${openStatus === "Open" ? 'open-status' : 'closed-status'}`}>
          <Clock size={16} /> {openStatus}
        </span>
        <span className="today-hours">{todaysFormattedHours}</span>
        <span className="expand-toggle">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {isExpanded && (
        <div className="bubble-expanded">
          {orderedDays.map(day => (
            <p key={day}>
              <strong>{day}: </strong>
              {location.hours[day]?.open
                ? `${formatTime(location.hours[day].open)} - ${formatTime(location.hours[day].close)}`
                : 'Closed'}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationHoursBubble;
