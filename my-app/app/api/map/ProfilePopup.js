import React from 'react';
import { useUser } from '@/app/context/UserContext';
import './ProfilePopup.css';

const ProfilePopup = ({ onClose }) => {
    const user = useUser();

    if (!user) {
        return null;
    }

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
                    <img src={user.photoURL || '/default-profile.png'} alt="Profile" className="profile-picture" />
                    <div className="profile-details">
                        <h2 className="profile-name">{user.displayName || 'Anonymous'}</h2>
                        <p className="profile-info">Email: {user.email}</p>
                        <p className="profile-info">Gender: {user.gender || 'Not Set'}</p>
                        <p className="profile-info">Phone: {user.phoneNumber || 'Not Set'}</p>
                        <p className="profile-info">Age: {age}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;
