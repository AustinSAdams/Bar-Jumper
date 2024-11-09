import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/api/firebase/firebaseConfig';
import UserCard from './userCard';
import './CurrentUsersList.css';


const MaleIcon = () => (
    <svg className="male-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 744.094 1052.362">
        <path fill="49d7fa" d="M302.075 1018.988c-15.82-5.19-28.348-16.866-31.926-29.752-1.426-5.135-2.106-110.18-2.113-326.659l-.011-319.09h-16.03v120.45c0 118.08-.082 120.594-4.143 127.737-5.26 9.251-11.169 13.586-22.73 16.678-17.094 4.572-35.789-4.158-42.502-19.847-4.319-10.095-4.038-279.339.31-296.03 9.799-37.62 41.532-68.442 78.543-76.285 19.496-4.131 199.75-4.182 219.189-.062 19.8 4.197 36.807 13.69 51.855 28.946 15.478 15.692 22.703 28.421 28.093 49.493 3.756 14.688 3.963 22.554 3.963 150.492 0 116.95-.412 135.98-3.082 142.37-4.151 9.936-8.423 14.405-17.957 18.783-15.82 7.264-35.927 2.59-45.281-10.525l-4.811-6.746-.546-122.727-.546-122.727h-15.94v320.657c0 351.5.795 328.162-11.627 341.25-9.814 10.34-19.82 14.251-36.462 14.251-16.641 0-26.648-3.911-36.461-14.25-12.181-12.835-11.628-2.887-11.628-209.006V607.976h-16.029V796.39c0 153.544-.5 189.606-2.702 194.86-4.037 9.634-12.819 19.131-22.037 23.834-8.885 4.533-29.056 6.64-37.39 3.905zm45.07-825.262c-24.222-8.65-39.193-21.987-49.79-44.351-5.865-12.379-6.288-14.757-6.288-35.355 0-20.841.364-22.822 6.48-35.244 30.543-62.043 118.723-62.195 149.215-.257 6.313 12.824 6.606 14.44 6.606 36.503 0 21.218-.453 24.007-5.601 34.49-8.648 17.61-21.421 30.452-38.868 39.074-13.546 6.695-16.986 7.529-33.405 8.096-13.778.476-20.788-.255-28.35-2.956z"/>
    </svg>
);

const FemaleIcon = () => (
    <svg className="female-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <circle fill="ee8afc" cx="22.875" cy="4.625" r="4.125"/>
        <path fill="ee8afc" d="M32.913 32l-5.909-16.237-.034-.167c0-.237.199-.429.447-.429.211 0 .388.141.435.329L31.869 26c.267.601 1.365 1 2.087 1 .965 0 1.065-1.895 1.044-2l-4.017-10.357C30.634 12.322 28.29 10 25.615 10H20.38c-2.675 0-5.193 2.322-5.542 4.643L11.001 25c-.087.199 0 2 1.043 2 .811 0 1.89-.283 2.087-1l3.875-10.549a.447.447 0 0 1 .421-.284c.247 0 .446.192.446.428l-.028.153L13.088 32c-.011.048 0 .951 0 1 0 .346.835 1 1.198 1H18v13.095c0 1.04.916 1.905 2 1.905s2-.866 2-1.905V33.991c0-.283 2-.274 2 .009v13c0 1.04.917 2 2 2 1.086 0 2-.961 2-2V34h3.869c.362 0 1.044-.654 1.044-1 0-.08.029-.931 0-1z"/>
    </svg>
);

const CurrentUsersList = ({ locationId }) => {
    const [currentUsers, setCurrentUsers] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [genderCounts, setGenderCounts] = useState({ men: 0, women: 0 });

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
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    return { id: userId, ...userData };
                }
                return null;
            });

            const userDataResults = await Promise.all(userDataPromises);
            const filteredData = userDataResults.filter(user => user !== null);

            const menCount = filteredData.filter(user => user.gender === 'Male').length;
            const womenCount = filteredData.filter(user => user.gender === 'Female').length;
            setGenderCounts({ men: menCount, women: womenCount });

            setUsersData(filteredData);
        };

        if (currentUsers.length > 0) {
            fetchUserData();
        } else {
            setUsersData([]);
            setGenderCounts({ men: 0, women: 0 });
        }
    }, [currentUsers]);

    let hiddenUserCount = 0;

    return (
        <div className="current-users-list">
            <h3 className="current-users-title">
                Current Users
                <span className="gender-count">
                    <MaleIcon /> {genderCounts.men}
                    <FemaleIcon /> {genderCounts.women}
                </span>
            </h3>
            <div className="current-users-container">
                {usersData.length > 0 ? (
                    usersData.map((user) => {
                        if (user.visibility === 'hidden') {
                            hiddenUserCount += 1;
                            return (
                                <div key={user.id} className="user-card">
                                    <div className="user-name">anon user {hiddenUserCount}</div>
                                </div>
                            );
                        }

                        return (
                            <UserCard
                                key={user.id}
                                friend={user}
                                friendsStatus={{ [user.id]: 'online' }}
                                handleUnfriend={null}
                                isFriend={false}
                            />
                        );
                    })
                ) : (
                    <p>No users currently here.</p>
                )}
            </div>
        </div>
    );
};

export default CurrentUsersList;
