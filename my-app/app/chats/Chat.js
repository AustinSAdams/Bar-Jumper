import { db, auth, storage, firestore } from '@/app/api/firebase/firebaseConfig';
import { collection, doc, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import './Chat.css';

const Chat = ({ chatrooms = [], chatroomId }) => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useUser();

  const handleChatroomSelect = async (chatroom) => {
    setSelectedChatroom(chatroom);
    setMessages([]);
    if (chatroomId) {
        console.log("Chatroom ID: ", chatroomId);
        console.log("Chatroom: ", chatroom);
        const chatroomRef = doc(db, 'chatrooms', chatroom.id); // get current selected location with document id
        const chatroomDoc = await getDoc(chatroomRef); 
        const messagesCollection = collection(chatroomDoc, 'messages');
        console.log("messages collection", messagesCollection);
        const messagesQuery = query(messagesCollection, orderBy('timestamp'));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
                id: doc.id, ...doc.data(),
            }));
        setMessages([]); 
        console.log("message Data: ", messagesData);
        });
    return() => unsubscribe();
    }
  };

  useEffect(() => {
    if (selectedChatroom) {
        handleChatroomSelect(selectedChatroom);
    }
  }, [selectedChatroom]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && user.uid) {
        console.log("Selected chatroom: ", selectedChatroom);
        console.log("Messages Collection Path:", `chatrooms/${selectedChatroom.id}/messages`);
        console.log("User: ", user.displayName);
        console.log("newMessage: ", newMessage);
        try {
            const messageRef = await addDoc(collection(db, `chatrooms/${selectedChatroom.id}/messages`), {
                text: newMessage,
                sender: user.displayName,
                timestamp: serverTimestamp(),
            });
            console.log("setNewMessage: ", newMessage);
            const newMessageData = {
                id: messageRef.id,
                text: newMessage,
                sender: user.displayName,
                timestamp: serverTimestamp(),
            };
            setMessages((prevMessages) => [...prevMessages, newMessageData]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setNewMessage('');
      };
      
    }

  return (
    <div className="chat-container">
      <div className="chatroom-list">
        <div className="chatroom-list-header">
            <h2> Chatrooms </h2>
        </div>
        <ul>
        {chatrooms.map((chatroom) => (
          <li key={chatroom.id}>
          <button key={chatroom.id} onClick={() => handleChatroomSelect(chatroom)}>
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
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sender === user.displayName ? 'sent' : 'received'}`}>
                 <div className="message-bubble">
                  <strong>{message.sender === user.displayName ? 'You' : message.sender}:</strong> {message.text}
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
