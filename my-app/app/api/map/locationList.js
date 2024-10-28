import React, { useState } from 'react';
import { X } from 'lucide-react';
import './locationList.css';

export const renderStars = (starCount) => {
  return Array.from({ length: 5 }, (_, index) => {
    const fullStarThreshold = index + 1;

    if (starCount >= fullStarThreshold) {
      return <span key={index} className="star filled">★</span>;

    } else if (starCount > index && starCount < fullStarThreshold) {
      return <span key={index} className="star half-filled">★</span>;

    } else {
      return <span key={index} className="star">★</span>;
    }
  });
}

const LocationList = ({ locations, onSelectLocation, onClose, theme }) => {
  return (
    <div className={`location-popup-content ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="location-popup-header">
        <h2 className={`location-popup-title ${theme === 'dark' ? 'dark-mode' : ''}`}>Bar Locations</h2>

    
        <SearchBar locations={locations} onSuggestionClick={onSelectLocation} />

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
              {renderStars(location.starCount || 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;

export function SearchBar({ locations, onSuggestionClick }) {
  const [searchQuery, setSearchQuery] = useState(""); // holds the value of the current text in the search bar
  const [suggestions, setSuggestions] = useState([]); // suggestions shown when the user types

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query); // updates search query state with input

    if (query) {
      // instead of fetching from firebase again, use whats already loaded (all docs) and filter it based on the query
      const filteredLocations = locations.filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(filteredLocations);

    } else {
      setSuggestions([]); // clears suggestions when the input is empty/closed
    }
  };
  
// style i used but change however, currently its using tailwind so no css file*/
  return (
    <div className="relative">
      <input
        className="w-[200px] h-[18px] bg-black rounded-[10px] px-2 text-sm"
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search Bars"
      />
      {suggestions.length > 0 && (
        <ul className="absolute top-[26.5px] left-0 w-[140px] bg-black border-3 border-[#001681] rounded-[10px] list-none p-0 m-0 z-50">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index} 
              onClick={() => onSuggestionClick(suggestion)}
              className="px-2 py-1 cursor-pointer hover:bg-gray-100 hover:text-black rounded-[10px]"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}