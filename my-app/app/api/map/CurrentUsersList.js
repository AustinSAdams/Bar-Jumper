import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/api/firebase/firebaseConfig';
import UserCard from './userCard';
import './CurrentUsersList.css';

const CurrentUsersList = ({ locationId }) => {
    const [currentUsers, setCurrentUsers] = useState([]);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        const fetchCurrentUsers = async () => {
            if (!locationId) return;

            const locationRef = doc(db, 'locations', locationId);
            const locationDoc = await getDoc(locationRef);

            if (locationDoc.exists()) {
                const data = locationDoc.data();
                setCurrentUsers(data.currentUsers || []);
            } else {
                setCurrentUsers([]);
            }
        };

        fetchCurrentUsers();
    }, [locationId]);

   
    useEffect(() => {
        const fetchUserData = async () => {
            const userDataPromises = currentUsers.map(async (userId) => {
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);
                return userDoc.exists() ? { id: userId, ...userDoc.data() } : null;
            });

            const userDataResults = await Promise.all(userDataPromises);
            setUsersData(userDataResults.filter(user => user !== null));
        };

        if (currentUsers.length > 0) {
            fetchUserData();
        } else {
            setUsersData([]);
        }
    }, [currentUsers]);

    return (
        <div className="current-users-list">
            <h3 className="current-users-title">Current Users</h3>
            <div className="current-users-container">
                {usersData.length > 0 ? (
                    usersData.map((user) => (
                        <UserCard
                            key={user.id}
                            friend={user}
                            friendsStatus={{ [user.id]: 'online' }}
                            handleUnfriend={null}
                            isFriend={false}
                        />
                    ))
                ) : (
                    <p>No users currently here.</p>
                )}
            </div>
        </div>
    );
};

export default CurrentUsersList;
