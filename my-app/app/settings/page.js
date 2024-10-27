"use client";
import './settings.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { uploadImage, updateUserDisplayName, updateUserPassword, logUserOut, deleteAuthAccount } from '../api/firebase/firebase';

export default function Page(){
    const user = useUser();
    const router = useRouter();

    const [authView, setAuthView] = useState("user");
    const [isNotLoggedIn, setIsNotLoggedIn] = useState(true);
    const [confirmAuthDeletion, setConfirmAuthDeletion] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [userErrorMessage, setUserErrorMessage] = useState('');

    useEffect(() => {
        if(user == null){
            setIsNotLoggedIn(true);
            setAuthView("none");
        }
        else{
            setIsNotLoggedIn(false);
            setAuthView('user');
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
    };

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
            const hashedPassword = hash(newPassword);
            await updateUserPassword(hashedPassword);
        }catch(err) {
            setErrorMessage(err);
        }
    };

    const handleLogoutClick = async () => {
        await logUserOut();
        window.location.reload();
    };

    const toggleDeletionConfirmation = () => {
        setConfirmAuthDeletion(!confirmAuthDeletion);
    };

    const handleRemoveAccount = async () => {
        try{
            await deleteAuthAccount(user.uid);
            window.location.reload();
        }catch(err){
            setErrorMessage(err);
        }
    };

    const handleToggleView = () => {
        setAuthView(authView === "user" ? "global" : "user");
    };

    return (
    <div className='main-box'>
        <nav className='nav-container'>
        <span className={authView === "global" ? "slider-label" : "slider-label-inactive"}>Global</span>
            <label className='switch'>
                <input 
                    type="checkbox" 
                    onChange={handleToggleView} 
                    checked={authView === "user"} 
                />
                <span className="slider"></span>
            </label>
            <span className={authView === "user" ? "slider-label" : "slider-label-inactive"}>User</span>
        </nav>
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
                    <p>{errorMessage}</p>
                )}
            </div>
        )}
        { authView == 'global' && user && (
            <div>
                <p>Global</p>
            </div>
        )}
        {isNotLoggedIn &&
            <p className='user-error'><br/>Please Login, Then Refresh The Page!</p>
        }
    </div>
    );
}