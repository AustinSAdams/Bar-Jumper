import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/api/firebase/firebaseConfig';
import './PartyCard.css';

const PartyCard = ({ party }) => {
    const [locationImage, setLocationImage] = useState('');
    const [locationName, setLocationName] = useState('');
    const [usernames, setUsernames] = useState([]);

    useEffect(() => {
        const fetchLocationData = async () => {
            if (party.locationId) {
                const locationRef = doc(db, 'locations', party.locationId);
                const locationDoc = await getDoc(locationRef);
                if (locationDoc.exists()) {
                    const locationData = locationDoc.data();
                    setLocationImage(locationData['loc-profile-Image'] || '/default-location.png');
                    setLocationName(locationData.name || 'Unknown Location');
                }
            }
        };

        const fetchUsernames = async () => {
            const friendPromises = party.friends.map(async (friendId) => {
                const friendDoc = await getDoc(doc(db, 'users', friendId));
                return friendDoc.exists() ? friendDoc.data().username : 'Unknown User';
            });
            const fetchedUsernames = await Promise.all(friendPromises);
            setUsernames(fetchedUsernames);
        };

        fetchLocationData();
        fetchUsernames();
    }, [party]);

    return (
        <div className="party-card">
            <img src={locationImage} alt="Location" className="party-card-image" />
            <div className="party-card-details">
                <h4 className="party-card-title">{party.partyName}</h4>
                <p className="party-card-info">
                    {locationName} • {party.arrivalDate} at {party.arrivalTime}
                </p>
                <div className="party-card-users">
                    {usernames.map((username, index) => (
                        <span key={index} className="party-card-user">{username}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PartyCard;
