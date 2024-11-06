import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@/app/context/UserContext";
import { addFriend, removeFriend, getAllDocuments } from "@/app/api/firebase/firebase";
import { Search, Plus } from "lucide-react";
import "./Friends.css";

export default function friendingPage({ onClose }){
    const user = useUser();
    const pageRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [userDocs, setUserDocs] = useState([]);
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
      async function fetchDocuments() {
        try{
          const documents = await getAllDocuments("users");
          setUserDocs(documents);

          const currentUserDoc = documents.find(doc => doc.id === user.uid);
          if(currentUserDoc) {
            const friendIds = currentUserDoc.friendsList.map(friend => friend.id);
            setFriendsList(friendIds);
          }
        }catch(err) {
          console.error("Error Fetching Documents");
        }
      }
      fetchDocuments();
    }, [user.uid])

    const handleSearching = (e) => {
      setSearchTerm(e.target.value.toLowerCase());
    };

    return(
        <div className="sidebar">
          <div className="search-bar-container">
            <input
              className="search-bar"
              placeholder="Search by Username..."
              value={searchTerm}
              onChange={handleSearching}
            />
            <hr className="border-gray-300 my-4" />
          </div>
          {userDocs
            .filter(doc => (
                (doc.id !== user.uid) && 
                (!friendsList.includes(doc.id))) &&
                ( searchTerm === "" || doc.username.toLowerCase().includes(searchTerm))
            )
            .map(doc => (
            <div key={doc.id} className="user-card">
              <img
                src={doc.photoUrl}
                alt={`${doc.username}'s profile`}
                className="profile-pic"
              />
              <div className="user-info">
                <h3>{doc.username}</h3>
                <p>{doc.email}</p>
              </div>
              <button onClick={()=>{addFriend(doc.id)}}>
                <Plus className="add-friend-button"/>
              </button>
            </div>
          ))}
          
        </div>
    );
};