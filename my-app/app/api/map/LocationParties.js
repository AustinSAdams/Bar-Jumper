
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/api/firebase/firebaseConfig';
import PartyCard from './PartyCard';
import './LocationParties.css';

const LocationParties = ({ locationId }) => {
  const [parties, setParties] = useState([]);

  useEffect(() => {
    const fetchParties = async () => {
      if (locationId) {
        const partiesSnapshot = await getDocs(collection(db, 'parties'));
        const locationParties = partiesSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(party => party.locationId === locationId);
        setParties(locationParties);
      }
    };

    fetchParties();
  }, [locationId]);

  return (
    <div className="location-parties">
      <h4>Scheduled Parties</h4>
      <div className="parties-list">
        {parties.length > 0 ? (
          parties.map(party => <PartyCard key={party.id} party={party} />)
        ) : (
          <p>No parties scheduled at this location.</p>
        )}
      </div>
    </div>
  );
};

export default LocationParties;
