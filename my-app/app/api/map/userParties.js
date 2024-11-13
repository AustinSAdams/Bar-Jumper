import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import { collection, getDocs, getDoc, addDoc } from 'firebase/firestore';
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
        if (user && user.friendsList) {
            const loadFriends = async () => {
                const friendData = await Promise.all(
                    user.friendsList.map(async (friendRef) => {
                        const friendDoc = await getDoc(friendRef);
                        return friendDoc.exists() ? { id: friendDoc.id, ...friendDoc.data() } : null;
                    })
                );
                setFriends(friendData.filter(friend => friend !== null));
            };
            loadFriends();
        }
    }, [user]);

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

    const handleDeleteParty = (partyId) => {
        setParties(parties.filter(party => party.id !== partyId));
    };

    return (
        <div className="userParties-container">
            <h3 className="userParties-title">My Parties</h3>
            <div className="userParties-partiesList">
                {parties.length > 0 ? (
                    parties.map(party => (
                        <PartyCard key={party.id} party={party} onDelete={handleDeleteParty} />
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
                    <form className="userParties-form">
                        <label>
                            Party Name:
                            <input
                                type="text"
                                value={partyName}
                                onChange={(e) => setPartyName(e.target.value)}
                            />
                        </label>
                        <label>
                            Location:
                            <select
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                            >
                                <option value="">Select Location</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Invite Friends:
                            <div className="userParties-friendsList">
                                {friends.map(friend => (
                                    <div key={friend.id} className="userParties-friendCheckbox">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedFriends.includes(friend.id)}
                                                onChange={() => toggleFriendSelection(friend.id)}
                                            />
                                            {friend.username || 'Unnamed'}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </label>
                        <label>
                            Arrival Date:
                            <input
                                type="date"
                                value={arrivalDate}
                                onChange={(e) => setArrivalDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Arrival Time:
                            <input
                                type="time"
                                value={arrivalTime}
                                onChange={(e) => setArrivalTime(e.target.value)}
                            />
                        </label>
                        <div className="userParties-overlayButtons">
                            <button type="button" className="userParties-cancelButton" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="button" className="userParties-confirmButton" onClick={handleConfirmParty}>
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserParties;
