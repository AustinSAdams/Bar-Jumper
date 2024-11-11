import { db } from '@/app/api/firebase/firebaseConfig';
import { doc, getDoc, setDoc, collection, updateDoc, addDoc, query, onSnapshot, serverTimestamp, arrayUnion, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import './Chat.css';

const Chat = ({ chatrooms }) => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [privateChatrooms, setPrivateChatrooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const user = useUser();


  useEffect(() => {
    if (user) {
      const fetchFriends = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const friendsList = userDoc.data().friendsList || [];
          const friendsData = await Promise.all(friendsList.map(async (friendRef) => {
            const friendDoc = await getDoc(friendRef);
            return { id: friendDoc.id, ...friendDoc.data() };
          }));
          console.log('Fetched friends list: ', friendsData);
          setFriends(friendsData);
        } else {
          console.log('No friends list found for user:', user.uid);
        }
      };
      fetchFriends();

      const q = query(collection(db, 'privateChatrooms'), where('users', 'array-contains', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chatroomsData = [];
        querySnapshot.forEach((doc) => {
          chatroomsData.push({ id: doc.id, ...doc.data() });
        });
        setPrivateChatrooms(chatroomsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Select a chatroom and set up a listener
  const handleChatroomSelect = async (chatroom) => {
    setSelectedChatroom(chatroom);
    setMessages([]);
    const chatroomDocRef = doc(db, chatroom.type === 'private' ? 'privateChatrooms' : 'chatrooms', chatroom.id);

    const unsubscribe = onSnapshot(chatroomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData.messages || []);

        if (chatroom.type === 'private') {
          (async () => {
            const friendId = chatData.users.find(uid => uid !== user.uid);
            const friendDoc = await getDoc(doc(db, 'users', friendId));
            const friendName = friendDoc.exists() ? friendDoc.data().username : 'Unknown User';
            setSelectedChatroom({ ...chatroom, name: friendName });
          })();
        } else {
          (async () => {
            const userNames = await Promise.all(chatData.users.map(async (uid) => {
              if (uid !== user.uid) {
                const userDoc = await getDoc(doc(db, 'users', uid));
                return userDoc.exists() ? userDoc.data().username : 'Unknown User';
              }
              return null;
            }));
            setSelectedChatroom({ ...chatroom, name: userName.filter(name => name !== null).join(', ') });
          })();
        }
      }
    });
    return () => unsubscribe();
  };

  /*useEffect(() => {
    if (selectedChatroom) handleChatroomSelect(selectedChatroom);
  }, [selectedChatroom]); */

  
  const handleSendMessage = async () => { 
    if (newMessage.trim() === '' || !user.uid || !selectedChatroom) return; 
    const chatroomDocRef = doc(db, selectedChatroom.type === 'private' ? 'privateChatrooms' : 'chatrooms', selectedChatroom.id);
  
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
  };

  const handleCreatePrivateChatroom = async (friendId) => {
    const chatroomId = [user.uid, friendId].sort().join('_');
    const chatroomDocRef = doc(db, 'privateChatrooms', chatroomId);

    try {
      await setDoc(chatroomDocRef, {
        users: [user.uid, friendId],
        messages: [],
      });
      handleChatroomSelect({ id: chatroomId, type: 'private' });
    } catch (error) {
      console.error('Error creating private chatroom:', error);
    }
  };

  const handleCreateGroupChatroom = async (friendIds) => {
    const chatroomDocRef = await addDoc(collection(db, 'privateChatrooms'), {
      users: [user.uid, ...friendIds],
      messages: [],
    });
    handleChatroomSelect({ id: chatroomDocRef.id, type: 'private'})
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
              <button onClick={() => handleChatroomSelect({ ...chatroom, type: 'public' })}>
                {chatroom.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="private-chatroom-list">
        <div className="private-chatroom-list-header">
          <h2>Private Chatrooms</h2>
        </div>
        <ul>
          {privateChatrooms.map((privateChatroom) => (
            <li key={privateChatroom.id}>
              <button onClick={() => handleChatroomSelect({ ...privateChatroom, type: 'private' })}>
                {privateChatroom.users && privateChatroom.users.length > 1 
                ? privateChatroom.users.filter(uid => uid !== user.uid).join(', ') : 'Unknown User'}
              </button>
            </li>
          ))}
          {friends.map((friend) => (
            <li key={friend.id}>
              <button onClick={() => handleCreatePrivateChatroom(friend.id)}>
                {friend.username}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => handleCreateGroupChatroom(friends.map(friend => friend.id))}>
          Create Group Chat
        </button>
      </div>
      <div className="chat-window">
        {selectedChatroom ? (
          <>
            <h2>{selectedChatroom.name || selectedChatroom.id}</h2>
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
