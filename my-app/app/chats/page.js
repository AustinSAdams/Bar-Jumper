"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/app/api/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Chat from './Chat';

export default function Page() {
  const [chatrooms, setChatrooms] = useState([]);

  // get chatrooms from chatrooms collection
  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const chatroomsCollection = collection(db, 'chatrooms');
        const chatroomsSnapshot = await getDocs(chatroomsCollection);
        const chatroomsList = chatroomsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChatrooms(chatroomsList);
      } catch (error) {
        console.error('Error fetching chatrooms:', error);
      }
    };

    fetchChatrooms();
  }, []);

  return (
    <div>
      <Chat chatrooms={chatrooms} /> 
    </div>
  );
}
