import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/app/api/firebase/firebaseConfig';
import PartyCard from './PartyCard';
import './userParties.css';

const UserParties = () => {
    const user = useUser();
    const [showOverlay, setShowOverlay] = useState(false);
    const [partyName, setPartyName] = useState('');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [arrivalDate, setArrivalDate] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [friends, setFriends] = useState([]);
    const [parties, setParties] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            const locationsSnapshot = await getDocs(collection(db, 'locations'));
            const locationList = locationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLocations(locationList);
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        const fetchParties = async () => {
            const partiesSnapshot = await getDocs(collection(db, 'parties'));
            const userParties = partiesSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(party => 
                    party.creatorId === user.uid || 
                    (party.friends && party.friends.includes(user.uid))
                );
            setParties(userParties);
        };
    
        fetchParties();
    }, [user]);
    
    const handleCreateParty = () => setShowOverlay(true);
    const handleCancel = () => setShowOverlay(false);

    const handleConfirmParty = async () => {
        try {
            const newParty = {
                partyName,
                locationId,
                creatorId: user.uid,
                arrivalDate,
                arrivalTime,
                friends: selectedFriends,
                createdAt: new Date()
            };
            await addDoc(collection(db, 'parties'), newParty);

            setShowOverlay(false);
            setPartyName('');
            setLocationId('');
            setSelectedFriends([]);
            setArrivalDate('');
            setArrivalTime('');

            setParties([...parties, newParty]);
        } catch (error) {
            console.error("Failed to create party:", error);
        }
    };

    const toggleFriendSelection = (friendId) => {
        setSelectedFriends(prevSelected =>
            prevSelected.includes(friendId)
                ? prevSelected.filter(id => id !== friendId)
                : [...prevSelected, friendId]
        );
    };

    return (
        <div className="userParties-container">
            <h3 className="userParties-title">My Parties</h3>
            <div className="userParties-partiesList">
                {parties.length > 0 ? (
                    parties.map(party => (
                        <PartyCard key={party.id} party={party} />
                    ))
                ) : (
                    <p>No current Parties</p>
                )}
            </div>
            <button className="userParties-createButton" onClick={handleCreateParty}>
                Create Party
            </button>

            {showOverlay && (
                <div className="userParties-overlay">
                    <h3>Create New Party</h3>
                    <button type="button" className="userParties-cancelButton" onClick={handleCancel}>Cancel</button>
                    <button type="button" className="userParties-confirmButton" onClick={handleConfirmParty}>Confirm Party</button>
                </div>
            )}
        </div>
    );
};

export default UserParties;
