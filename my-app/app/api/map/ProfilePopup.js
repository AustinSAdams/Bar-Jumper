import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { getDoc } from 'firebase/firestore';
import { Trash2, MessageSquareText  } from 'lucide-react';
import { removeFriend } from '@/app/api/firebase/firebase';
import './ProfilePopup.css';
import '@/app/components/Friends/Friends.css';

const ProfilePopup = ({ onClose }) => {
    const user = useUser();
    const [friends, setFriends] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
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
                <h3>My Friends</h3>
                <div className="friends-container">
                    {friends.slice(0, isExpanded ? friends.length : 3).map((friend) => (
                        <div key={friend.id} className="friend-card">
                            
                            <div className="friend-info-row">
                                <img src={friend.photoUrl || '/default-profile.png'} alt="Friend" className="friend-picture" />
                                <h4 className="friend-name">{friend.username || 'Unknown'}</h4>
                            </div>

                            <div className="action-container">
                                <button className="message-button">
                                    <MessageSquareText size={16} color="green" />
                                </button>
                                <button 
                                    className="unfriend-button" 
                                    onClick={() => handleUnfriend(friend.id)}
                                >
                                    <Trash2 size={16} color="red" />
                                </button>
                            </div>
                        </div>
                    ))}
                        </div>

                        <button 
                            className="friends-tab-button" 
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? "Close Friends View" : "View All Friends"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePopup;
