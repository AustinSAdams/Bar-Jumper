import React from 'react';
import { Circle, MessageSquareText, Trash2 } from 'lucide-react';

const FriendCard = ({ friend, friendsStatus, handleUnfriend }) => {
    return (
        <div className="friend-card">
            <div className="green-dot">
                <Circle size={12} color={friendsStatus[friend.id] === 'online' ? 'green' : 'red'} fill={friendsStatus[friend.id] === 'online' ? 'green' : 'red'} />
                <span className="tooltip">{friendsStatus[friend.id] === 'online' ? 'Online Now' : 'Offline'}</span>
            </div>
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
    );
};

export default FriendCard;