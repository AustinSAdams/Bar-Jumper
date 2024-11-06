import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { getDoc } from 'firebase/firestore';
import { Trash } from 'lucide-react';
import { removeFriend } from '@/app/api/firebase/firebase';
import './ProfilePopup.css';
import '@/app/components/Friends/Friends.css';

const ProfilePopup = ({ onClose }) => {
    const user = useUser();
    const [friends, setFriends] = useState([]);
    const db = user.db;

    useEffect(() => {
        if (user && user.friendsList) {
            const fetchFriends = async () => {
                try {
                    const friendsData = await Promise.all(
                        user.friendsList.map(async (friendRef) => {
                            const friendDoc = await getDoc(friendRef);
                            return friendDoc.exists() ? { id: friendDoc.id, ...friendDoc.data() } : null;
                        })
                    );
                    setFriends(friendsData.filter(friend => friend !== null));
                } catch (error) {
                    console.error("Failed to fetch friends:", error);
                }
            };
            fetchFriends();
        }
    }, [user]);

    const handleUnfriend = async (friendId) => {
        try {
            await removeFriend(friendId);
            setFriends(friends.filter(friend => friend.id !== friendId));
        } catch (error) {
            console.error("Failed to remove friend:", error);
        }
    };

    const calculateAge = (birthday) => {
        if (!birthday) return 'Not Set';
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(user.birthday);

    return (
        <div className="profile-popup open">
            <div className="profile-popup-content">
                <button onClick={onClose} className="profile-popup-close">✕</button>
                <div className="profile-header">
                    <img src={user.photoUrl || '/default-profile.png'} alt="Profile" className="profile-picture" />
                    <div className="profile-details">
                        <div className="profile-name-age">
                            <h2 className="profile-name">{user.username || 'Anonymous'}</h2>
                            <span className="profile-age"> {age}</span>
                        </div>
                        <p className="profile-info">Gender: {user.gender || 'Not Set'}</p>
                        <p className="profile-info">Email: {user.email}</p>
                        <p className="profile-info">Phone: {user.phoneNumber || 'Not Set'}</p>
                    </div>
                </div>

                {/* Friends List */}
                {friends.length > 0 && (
                    <div className="friends-list">
                        <h3>Friends</h3>
                        <div className="friends-container">
                            {friends.map((friend) => (
                                <div key={friend.id} className="user-card">
                                    <img src={friend.photoUrl || '/default-profile.png'} alt="Friend" className="profile-pic" />
                                    <div className="user-info">
                                        <h3>{friend.username || 'Unknown'}</h3>
                                        <p>{friend.email}</p>
                                    </div>
                                    <button 
                                        className="unfriend-button" 
                                        onClick={() => handleUnfriend(friend.id)}
                                    >
                                        <Trash size={20} color="red" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePopup;
