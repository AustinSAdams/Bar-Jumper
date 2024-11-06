import { db } from '@/app/api/firebase/firebaseConfig';
import { doc, updateDoc, onSnapshot, serverTimestamp, arrayUnion } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import './Chat.css';

const Chat = ({ chatrooms = [], chatroomId }) => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useUser();

  // Select a chatroom and set up a listener
  const handleChatroomSelect = async (chatroom) => {
    setSelectedChatroom(chatroom);
    setMessages([]);
    const chatroomDocRef = doc(db, 'chatrooms', chatroom.id);

    const unsubscribe = onSnapshot(chatroomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData.messages || []);
      }
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    if (selectedChatroom) handleChatroomSelect(selectedChatroom);
  }, [selectedChatroom]);

  
  const handleSendMessage = async () => { 
    if (newMessage.trim() && user.uid && selectedChatroom) {
      const chatroomDocRef = doc(db, 'chatrooms', selectedChatroom.id);
  
      const newMessageData = {
        text: newMessage.trim(),
        senderId: user.uid,
        senderName: user.displayName,
        timestamp: new Date(), 
        imageUrl: '', // optional if they upload an image
      };
  
      try {
        // add the message without serverTimestamp initially, cuz firestore doesn't allow it server side
        await updateDoc(chatroomDocRef, {
          messages: arrayUnion(newMessageData),
        });
  
        setNewMessage(''); // clear the textbox after sending a message
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chatroom-list">
        <div className="chatroom-list-header">
          <h2>Chatrooms</h2>
        </div>
        <ul>
          {chatrooms.map((chatroom) => (
            <li key={chatroom.id}>
              <button onClick={() => handleChatroomSelect(chatroom)}>
                {chatroom.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        {selectedChatroom ? (
          <>
            <h2>{selectedChatroom.name}</h2>
            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.senderId === user.uid ? 'sent' : 'received'}`}>
                  <div className="message-bubble">
                    <strong>{message.senderId === user.uid ? 'You' : message.senderName}:</strong> {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chatroom-main">
            <h2>Welcome to the Chatroom Lobby!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
