import React from 'react';
import { useUser } from '@/app/context/UserContext';
import './ProfilePopup.css';

const ProfilePopup = ({ onClose }) => {
    const user = useUser();

    if (!user) {
        return null;
    }

    return (
        <div className="profile-popup open">
            <div className="profile-popup-content">
                <img src={user.photoURL || '/default-profile.png'} alt="Profile" className="profile-picture" />
                <div className="profile-info">{user.displayName || 'Anonymous'}</div>
                <div className="profile-info">{user.email}</div>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ProfilePopup;
