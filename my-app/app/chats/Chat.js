import { db } from '@/app/api/firebase/firebaseConfig';
import { doc, getDoc, setDoc, collection, updateDoc, addDoc, query, onSnapshot, serverTimestamp, arrayUnion, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import './Chat.css';

const Chat = ({ chatrooms }) => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [activeChats, setActiveChats] = useState('none')
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [privateChatrooms, setPrivateChatrooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const [privateChatroomUsernames, setPrivateChatroomUsernames] = useState({});
  const user = useUser();


  useEffect(() => {
    if (user) {
      const fetchFriends = async () => {  //get users friendsList from firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const friendsList = userDoc.data().friendsList || [];
          const friendsData = await Promise.all(friendsList.map(async (friendRef) => {
            const friendDoc = await getDoc(friendRef);
            return { id: friendDoc.id, ...friendDoc.data() };  //if they have a friend on list, return that
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


  const chatroomSets = {
    none: [],
    global: chatrooms,
    private: privateChatrooms
  }
  // Select a chatroom and set up a listener
  const handleChatroomSelect = async (chatroom) => {
    setSelectedChatroom(chatroom);
    setMessages([]);
    const chatroomDocRef = doc(db, chatroom.type === 'private' ? 'privateChatrooms' : 'chatrooms', chatroom.id);

    const unsubscribe = onSnapshot(chatroomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData.messages || []);   //takes a snapshot of the messages and adds them to chatData.messages or an empty array to be created

        if (chatroom.type === 'private') {
          (async () => {   //need this to avoid non-async function error
            const friendId = chatData.users.find(uid => uid !== user.uid);
            const friendDoc = await getDoc(doc(db, 'users', friendId));   //used to get usernames to be more easily passed into div so it won't display id
            const friendName = friendDoc.exists() ? friendDoc.data().username : 'Unknown User';
            setSelectedChatroom({ ...chatroom, name: friendName });
          })();
        } else {
          (async () => {
            const userNames = await Promise.all(chatData.users.map(async (uid) => {
              if (uid !== user.uid) {
                const userDoc = await getDoc(doc(db, 'users', uid));  // getDoc on users collection for each user that is not in the chatroom
                return userDoc.exists() ? userDoc.data().username : 'Unknown User';
              }
              return null;
            }));
            setSelectedChatroom({ ...chatroom, name: userNames.filter(name => name !== null).join(', ') });
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
    //new function to remove chance of duplicate chatrooms with same person from onClick
  const handleCreateorSelectPrivateChatroom = async (friendId) => {
    const existingChatroom = privateChatrooms.find(chatroom => 
      chatroom.users.includes(friendId) && chatroom.users.includes(user.uid)
    );
    if (existingChatroom) {
      handleChatroomSelect({ ...existingChatroom, type: 'private' });
    } else {
      const newChatroom = {
        users: [user.uid, friendId],  //if there is no existing chatroom with 2 users, creates one.
        messages: [],
        type: 'private'
      };
      const chatroomDocRef = await addDoc(collection(db, 'privateChatrooms'), newChatroom);
      setPrivateChatrooms([...privateChatrooms, { id: chatroomDocRef.id, ...newChatroom }]);
      handleChatroomSelect({ id: chatroomDocRef.id, ...newChatroom, type: 'private' });
    }
  };

  const handleCreateGroupChatroom = async (friendIds) => {
    const chatroomDocRef = await addDoc(collection(db, 'privateChatrooms'), {
      users: [user.uid, ...friendIds],
      messages: [],
    });
    handleChatroomSelect({ id: chatroomDocRef.id, type: 'private'})
  };

    //fetches usernames from firestore, again for div display
  const fetchUsernames = async (userIds) => {
    const usernames = await Promise.all(userIds.map(async (uid) => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data().username : 'Unknown User';
  }));
  return usernames;
  };

  useEffect(() => {
    const fetchAndSetUsernames = async () => {
      const usernames = {};
      for (const chatroom of privateChatrooms) {
        const userIds = chatroom.users.filter(uid => uid !== user.uid);
        usernames[chatroom.id] = await fetchUsernames(userIds);
      }
      setPrivateChatroomUsernames(usernames);
    };
    fetchAndSetUsernames();
  }, [privateChatrooms, user]);

  return (
    <div className="chat-container">
      <div className="chatroom-list">
        <div className="chatroom-list-header">
          <h2>Chats</h2>
        </div>
        <ul>
          {chatroomSets[activeChats].map((chatroom) => (
            <li key={chatroom.id}>
              <button onClick={() => handleChatroomSelect({ ...chatroom, type: 'public' })}>
                {chatroom.name}
              </button>
            </li>
          ))}
        </ul>
        <div className = "chatroom-set-buttons">
            <button onClick={() => setActiveChats('global')}>Global Chats</button>  
            <button onClick={() => setActiveChats('private')}>Private Chats</button>
          </div>
      </div>
      <div className="private-chatroom-list">
        <div className="private-chatroom-list-header">
          <h2>Private Chatrooms</h2>
        </div>
        <ul>
          {privateChatrooms.map((privateChatroom) => (
            <li key={privateChatroom.id}>
              <button onClick={() => handleChatroomSelect({ ...privateChatroom, type: 'private' })}>
                {privateChatroomUsernames[privateChatroom.id]
                ? privateChatroomUsernames[privateChatroom.id].join(', ')
                : 'Loading...'}
              </button>
            </li>
          ))}
          {friends.map((friend) => (
            <li key={friend.id}>
              <button onClick={() => handleCreateorSelectPrivateChatroom(friend.id)}>
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
