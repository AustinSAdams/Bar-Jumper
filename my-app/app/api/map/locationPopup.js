import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as turf from '@turf/turf';
import { Phone, X, ArrowLeft, Footprints, Car, MessageSquare, Tally2, BookOpenText, Clock } from 'lucide-react';
import './locationPopup.css';
import LocationHoursBubble from './locationHoursBubble';
import LocationList from './locationList';
import { MAPBOX_TOKEN } from './map';
import FavoriteButton from './FavoriteButton';
import LocationImageGallery from './locationImageGallery';
import { getOpenStatus } from './locationHoursBubble';
import { renderStars } from './locationList';
import LocationReviews from './locationReviews';

const calculateDistance = (userLocation, locationCoords) => {
  if (!userLocation || !locationCoords.longitude || !locationCoords.latitude) return null;    // null if any cords missing
  const from = turf.point([userLocation.longitude, userLocation.latitude]);                  // create a point for userLocation
  const to = turf.point([locationCoords.longitude, locationCoords.latitude]);               // create a point for locationCoords
  return turf.distance(from, to, { units: 'miles' }).toFixed(1);                           // calculate the distance between the two points, in miles, 1 decimal pt.
};

const getTravelTimeAndMode = async (userLocation, locationCoords) => {
  const distance = calculateDistance(userLocation, locationCoords);
  const travelMode = distance <= 1 ? 'walking' : 'driving';                       // determine travel mode based on user distance from location (less= 1 mi = walking)

  const url = `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${userLocation.longitude},${userLocation.latitude};${locationCoords.longitude},${locationCoords.latitude}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;

  try {
    const response = await fetch(url);                                                   // get the directions from Mapbox API
    const data = await response.json();                                                 // parse the response
    const travelTime = data.routes[0].duration / 60;                                   // get the travel time in minutes from the response
    return { travelTime: Math.round(travelTime), travelMode, route: data.routes[0].geometry };

  } catch (err) {
    console.error('Error fetching directions:', err);
    return { travelTime: null, travelMode, route: null };
  }
};

const LocationDetails = ({ locations, location, onClose, userLocation, theme, onGetDirections, isOpen, onSelectLocation, view, onChangeView }) => {
  const [portalRoot, setPortalRoot] = useState(null);                                   // portal root state
  const [travelTime, setTravelTime] = useState(null);                                  // travel time state
  const [travelMode, setTravelMode] = useState('walking');                            // travel mode state
  const [directionsRoute, setDirectionsRoute] = useState(null);                      // stores fetched route, null = no route
  const [selectedImage, setSelectedImage] = useState(null);                         // For future image preview functionality
  const [isExpanded, setIsExpanded] = useState(false);                             // state to track if popup is expanded
  const popupRef = useRef(null);                                                  // ref to the popup element
  
  const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  const openStatus = location && location.hours 
    ? getOpenStatus(location.hours, currentDay, currentTime) : 'Closed';

  useEffect(() => {
    setPortalRoot(document.body);                     // sets root of the portal to doc for render (allows it to visually appear)

    if (userLocation && location) {
      getTravelTimeAndMode(userLocation, location).then(({ travelTime, travelMode, route }) => {
        setTravelTime(travelTime);
        setTravelMode(travelMode);
        setDirectionsRoute(route);
      });
    }
  }, [userLocation, location]); // get current dependencies for useEffect

  if (!portalRoot) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // toggle expanded state
  };

  const dismissPopup = (e) => {   // allows popup to close when clicked outside of window (not functional atm)
    if (e.target === e.currentTarget) onClose();
  };

  const handleGetDirections = () => {
    if (directionsRoute) {
      onGetDirections(location, travelMode);
    }
  };

  const renderContent = () => { // THIS is what allows switching between list and loc popup view. It returns the other component when new view triggered
    if (view === 'list') {
      return (
        <LocationList
          locations={locations}
          onSelectLocation={onSelectLocation}
          onClose={onClose}
          theme={theme}
        />
      );
    } else if (location) {
      const { phone, name, address, 'loc-profile-Image': profileImage } = location; // unpack location data for selected location
      const distance = calculateDistance(userLocation, location);

      return (
        <div className={`location-popup-content ${theme === 'dark' ? 'dark-mode' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`} onClick={(e) => e.stopPropagation()}>
          <div className="location-popup-header">
            <button onClick={() => onChangeView('list')} className={`location-popup-arrow ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <ArrowLeft size={24} />
            </button>

            {/* profile image  */}
            <div className="profile-image-container">
              {profileImage && (
                <img
                  src={profileImage}
                  alt={`${name} image`}
                  className="location-popup-image"
                />
              )}
            </div>

            {/* location details container */}
            <div className="location-details-container">
              <h2 className={`location-popup-title ${theme === 'dark' ? 'dark-mode' : ''}`}>{name}</h2>
              <div className={`status-indicator ${openStatus === "Open Now" ? 'open-status' : 'closed-status'}`}>
                <Clock size={16} /> {openStatus} {distance && ` - ${distance} miles away`}
              </div>
              <h3 className={`location-popup-address ${theme === 'dark' ? 'dark-mode' : ''}`}>
                {address || 'N/A'}
              </h3>
              <h4 className={`location-popup-phone ${theme === 'dark' ? 'dark-mode' : ''}`}>
                <Phone size={17} strokeWidth={3} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                <a href={`tel:${phone}`}>{phone || 'N/A'}</a>
              </h4>
              <h5 className='location-review-stars'>
              {renderStars(location.starCount || 0)}
              </h5>
            </div>

            <button onClick={onClose} className={`location-popup-close ${theme === 'dark' ? 'dark-mode' : ''}`}>
              <X size={24} />
            </button>
          </div>

          {/* 'action' buttons */}
          <div className="location-actions">
            <FavoriteButton locationId={location.id} initialFavoritesCount={location.favoritesCount || 0} />
            {travelTime !== null && (
              <button className={`travel-info-bubble ${theme === 'dark' ? 'dark-mode' : ''}`} onClick={handleGetDirections} disabled={!directionsRoute}>
                {travelMode === 'walking' ? <Footprints /> : <Car />}
                <span>{travelTime} min</span>
              </button>
            )}
            <button className={`chat-bubble ${theme === 'dark' ? 'dark-mode' : ''}`}> <MessageSquare size={24} strokeWidth={2} /> </button>
            <button className={`menu-bubble ${theme === 'dark' ? 'dark-mode' : ''}`}> <BookOpenText size={24} strokeWidth={2} /> </button>
          </div>

          {/* only visible when expanded */}
          {isExpanded && (
            <>
              <div className="hours-section">
                <LocationHoursBubble location={location} theme={theme} />
              </div>
              <div className="gallery-section">
                <LocationImageGallery location={location} theme={theme} onImageSelect={setSelectedImage} />
              </div>
              <div className="reviews-section">
              <LocationReviews location={location} theme={theme} />
              </div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return createPortal(
    <div className={`location-popup ${isOpen ? 'open' : ''}`} onClick={dismissPopup} ref={popupRef}>
      {/* Expand/Collapse Arrow */}
      <button className="expand-arrow" onClick={toggleExpand}>
        {isExpanded ? <Tally2 size={24} /> : <Tally2 size={24} />}
      </button>

      {renderContent()}

      {selectedImage && (
        <div className="image-preview-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" className="image-preview" />
        </div>
      )}
    </div>,
    portalRoot
  );
};

export default LocationDetails;
