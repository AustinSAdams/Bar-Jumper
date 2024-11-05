"use client";
import './settings.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { uploadImage, updateUserDisplayName, updateUserPassword, logUserOut, deleteAuthAccount, updateUserBirthday, updateUserPhoneNumber, updateUserGender } from '../api/firebase/firebase';

export default function Page(){
    const user = useUser();
    const router = useRouter();

    const [authView, setAuthView] = useState("user");
    const [isNotLoggedIn, setIsNotLoggedIn] = useState(true);
    const [confirmAuthDeletion, setConfirmAuthDeletion] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newBirthday, setNewBirthday] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newGender, setNewGender] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [userErrorMessage, setUserErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [birthdayErrorMessage, setBirthdayErrorMessage] = useState('');
    const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useState('');
    const [genderErrorMessage, setGenderErrorMessage] = useState('');

    useEffect(() => {
        if(user == null){
            setIsNotLoggedIn(true);
            setAuthView("none");
        }
        else{
            setIsNotLoggedIn(false);
            setAuthView('user');
            setNewDisplayName(user.displayName || '');
            setNewBirthday(user.birthday || '');
            setNewPhoneNumber(user.phoneNumber || '');
            setNewGender(user.gender || '');
        }
    }, [user]);

    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((bytes) => bytes.toString(16).padStart(2, '0'))
          .join('');
        return hashHex;
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(selectedFile){
            try{
                await uploadImage(selectedFile);
                window.location.reload()
            }catch(err){
                setErrorMessage(err);
            }
        }
    };

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        const username = newDisplayName.trim();
        try {
            if(username === '' || username.length === 0){
                throw new Error("Cannot Have An Empty Username!");
            }
            await updateUserDisplayName(newDisplayName.trim());
            window.location.reload()
        }catch(err) {
            setUserErrorMessage(err.message);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try{
            const hashedPassword = await hash(newPassword);
            await updateUserPassword(hashedPassword);
        }catch(err) {
            setPasswordErrorMessage(err.message);
        }
    };

    const handleBirthdayUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserBirthday(newBirthday);
            window.location.reload();
        } catch (err) {
            setBirthdayErrorMessage(err.message);
        }
    };

    const handlePhoneNumberUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserPhoneNumber(newPhoneNumber);
            window.location.reload();
        } catch (err) {
            setPhoneNumberErrorMessage(err.message);
        }
    };

    const handleGenderUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserGender(newGender);
            window.location.reload();
        } catch (err) {
            setGenderErrorMessage(err.message);
        }
    };

    const handleLogoutClick = async () => {
        await logUserOut();
        window.location.reload();
    };

    const toggleDeletionConfirmation = () => {
        setErrorMessage('');
        setConfirmAuthDeletion(!confirmAuthDeletion);
    };

    const handleRemoveAccount = async () => {
        try{
            await deleteAuthAccount(user.uid);
            window.location.reload();
        }catch(err){
            setErrorMessage(err.message);
        }
    };

    return (
    <div className='main-box'>
        { authView == 'user' && user && (
            <div className='user-settings'>

                <img src={user.photoURL} className='user-picture'></img>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label htmlFor="imageUpload">Upload an image:</label>
                    <input type="file" id="imageUpload" name="image" accept="image/*" onChange={handleFileChange} />
                    <button type="submit" className="upload-button">Upload</button>
                </form>

                <p className='user-label'>Username:</p>
                <p className='user-info'>{user.displayName}</p>
                <form onSubmit={handleUsernameUpdate}>
                    <label>
                        New Username:
                        <input
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            className='update-textbox'
                        />
                    </label>
                    <button type="submit" className='upload-button'>Update Username</button>
                </form>
                {userErrorMessage && (
                    <p className="error-message">{userErrorMessage}</p>
                )}

                <p className='user-label'>Email:</p>
                <p className='user-info'>{user.email}</p>

                <p className='user-label'>Password:</p>
                <p className='user-info'>********</p>
                <form onSubmit={handlePasswordUpdate}>
                    <label>
                        New Password:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='update-textbox'
                        />
                    </label>
                    <button type="submit" className='upload-button'>Update Password</button>
                </form>
                {passwordErrorMessage && (
                    <p className="error-message">{passwordErrorMessage}</p>
                )}

                <p className='user-label'>Birthday:</p>
                <p className='user-info'>{user.birthday || 'Not Set'}</p>
                <form onSubmit={handleBirthdayUpdate}>
                    <label>
                        New Birthday:
                        <input
                            type="date"
                            value={newBirthday}
                            onChange={(e) => setNewBirthday(e.target.value)}
                            className='update-textbox'
                        />
                    </label>
                    <button type="submit" className='upload-button'>Update Birthday</button>
                </form>
                {birthdayErrorMessage && (
                    <p className="error-message">{birthdayErrorMessage}</p>
                )}

                <p className='user-label'>Phone Number:</p>
                <p className='user-info'>{user.phoneNumber || 'Not Set'}</p>
                <form onSubmit={handlePhoneNumberUpdate}>
                    <label>
                        New Phone Number:
                        <input
                            type="tel"
                            value={newPhoneNumber}
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                            className='update-textbox'
                        />
                    </label>
                    <button type="submit" className='upload-button'>Update Phone Number</button>
                </form>
                {phoneNumberErrorMessage && (
                    <p className="error-message">{phoneNumberErrorMessage}</p>
                )}

                <p className='user-label'>Gender:</p>
                <p className='user-info'>{user.gender || 'Not Set'}</p>
                <form onSubmit={handleGenderUpdate}>
                    <label>
                        New Gender:
                        <select
                            value={newGender}
                            onChange={(e) => setNewGender(e.target.value)}
                            className='update-textbox'
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </label>
                    <button type="submit" className='upload-button'>Update Gender</button>
                </form>
                {genderErrorMessage && (
                    <p className="error-message">{genderErrorMessage}</p>
                )}

                <button 
                    onClick={handleLogoutClick}
                    className='logout-button'
                >Logout</button>
    
                <button
                    onClick={toggleDeletionConfirmation}
                    className='logout-button'
                >Delete Account</button>
                {confirmAuthDeletion && (
                    <div>
                        <p>Are you sure you want to delete your account?</p>
                        <div className="account-deletion-container">
                            <button
                                className='deletion-button'
                                onClick={handleRemoveAccount}
                            >Yes</button>
                            <button
                                onClick={toggleDeletionConfirmation}
                                className='deletion-button'
                            >No</button>
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <p className='error-message'>{errorMessage}</p>
                )}
            </div>
        )}
        {(isNotLoggedIn || authView === 'none') &&
            <div className='error-screen'>
                <p className='user-error'><br/>Please Login, Then Refresh The Page!</p>
                <button
                    onClick={()=>router.push("./")}
                    className='err-home-btn'
                >Go To Homepage</button>
            </div>
        }
    </div>
    );
}