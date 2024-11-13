import { db } from '@/app/api/firebase/firebaseConfig';
import { doc, getDoc, setDoc, collection, updateDoc, addDoc, query, onSnapshot, serverTimestamp, arrayUnion, where, deleteDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import './Chat.css';
import { X } from 'lucide-react';

const Chat = ({ chatrooms }) => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [activeChats, setActiveChats] = useState('none');
  const [friendFlag, setFriendFlag] = useState('False');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [privateChatrooms, setPrivateChatrooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const [privateChatroomUsernames, setPrivateChatroomUsernames] = useState({});
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isFriendListVisible, setIsFriendListVisible] = useState(false);
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
            return { id: friendDoc.id, ...friendDoc.data() };   //if they have a friend on list, return that
          }));
          setFriends(friendsData);
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
  };

  const filteredFriends = friendFlag === 'True' ? friends : [];

  const handleChatroomSelect = async (chatroom) => {
    setSelectedChatroom(chatroom);
    setMessages([]);
    const chatroomDocRef = doc(db, chatroom.type === 'private' ? 'privateChatrooms' : 'chatrooms', chatroom.id);

    const unsubscribe = onSnapshot(chatroomDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data();
        setMessages(chatData.messages || []);   //takes a snapshot of the messages and adds them to chatData.messages or an empty array to be created

        if (chatroom.type === 'private') {
          (async () => {
            const userNames = await Promise.all((chatData.users || []).map(async (uid) => {
              const userDoc = await getDoc(doc(db, 'users', uid));
              return userDoc.exists() ? userDoc.data().username : 'Unknown User';
            }));
            setSelectedChatroom({ ...chatroom, name: userNames.join(', ') });
          })();
        } else {
          (async () => {
            const userNames = await Promise.all((chatData.users || []).map(async (uid) => {
              if (uid !== user.uid) {
                const userDoc = await getDoc(doc(db, 'users', uid));  // getDoc on users collection for each user that is not in the chatroom
                return userDoc.exists() ? userDoc.data().username : 'Unknown User';
              }
              return null;
            }));
            setSelectedChatroom({ ...chatroom, name: userNames.join(', ') });
          })();
        }
      }
    });
    return () => unsubscribe();
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user.uid || !selectedChatroom) return;
    const chatroomDocRef = doc(db, selectedChatroom.type === 'private' ? 'privateChatrooms' : 'chatrooms', selectedChatroom.id);

    const newMessageData = {
      text: newMessage.trim(),
      senderId: user.uid,
      senderName: user.displayName,
      timestamp: new Date(),
      imageUrl: '',
    };

    try {
      await updateDoc(chatroomDocRef, {
        messages: arrayUnion(newMessageData),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateorSelectPrivateChatroom = async (friendId) => {
    const existingChatroom = privateChatrooms.find(chatroom =>
      chatroom.users.includes(friendId) && chatroom.users.includes(user.uid) && !chatroom.isGroupChat
    );

    if (existingChatroom) {
      handleChatroomSelect({ ...existingChatroom, type: 'private' });
    } else {
      const newChatroom = {
        users: [user.uid, friendId],
        messages: [],
        type: 'private',
        isGroupChat: false
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
      isGroupChat: true
    });
    handleChatroomSelect({ id: chatroomDocRef.id, type: 'private' });
  };

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

  const handleFriendSelection = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  const handleCreateGroupChat = () => {
    handleCreateGroupChatroom(selectedFriends);
    setIsFriendListVisible(false);
    setSelectedFriends([]);
  };

  const handleDeleteChatroom = async (chatroomId, type) => {
    try {
      const chatroomDocRef = doc(db, type === 'private' ? 'privateChatrooms' : 'chatrooms', chatroomId);
      await deleteDoc(chatroomDocRef);
      setChatrooms(chatrooms.filter(chatroom => chatroom.id !== chatroomId));
      setPrivateChatrooms(privateChatrooms.filter(chatroom => chatroom.id !== chatroomId));
    } catch (error) {
      console.error('Error deleting chatroom:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chatroom-list">
        <div className="chatroom-list-header">
          <h2>Chats</h2>
        </div>
        <ul>
          {activeChats === 'global' && chatrooms.map((chatroom) => (
            <li key={chatroom.id} className="chatroom-item">
              <button onClick={() => handleChatroomSelect({ ...chatroom, type: 'public' })}>
                {chatroom.name}
              </button>
              <X size={16} onClick={() => handleDeleteChatroom(chatroom.id, 'public')} className="delete-chatroom-button" />
            </li>
          ))}
        </ul>
        {activeChats === 'private' && (
          <div>
            <div className="private-chatrooms-list-header">
              <h3>Private Chats</h3>
            </div>
            <ul>
              {privateChatrooms.map((privateChatroom) => (
                <li key={privateChatroom.id} className="chatroom-item">
                  <button onClick={() => handleChatroomSelect({ ...privateChatroom, type: 'private' })}>
                    {privateChatroomUsernames[privateChatroom.id]
                      ? privateChatroomUsernames[privateChatroom.id].join(', ')
                      : 'Loading...'}
                  </button>
                  <X size={16} onClick={() => handleDeleteChatroom(privateChatroom.id, 'private')} className="delete-chatroom-button" />
                </li>
              ))}
            </ul>
            <div className="private-chat-friends-list-header">
              <h3>Friends</h3>
            </div>
            <ul>
              {filteredFriends.map((friend) => (
                <li key={friend.id}>
                  <button onClick={() => handleCreateorSelectPrivateChatroom(friend.id)}>
                    {friend.username}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="chatroom-set-buttons" tabindex="-1">
          <button onClick={() => { setActiveChats('global'); setFriendFlag('False') }}>Global Chats</button>
          <button onClick={() => { setActiveChats('private'); setFriendFlag('True') }}>Private Chats</button>
          <button onClick={() => setIsFriendListVisible(!isFriendListVisible)}>Create Group Chat</button>
        </div>
        {isFriendListVisible && (
          <div className="friend-selection-list">
            <div className="friend-selection-list-header">
              <h2>Select Friends</h2>
            </div>
            <ul>
              {friends.map((friend) => (
                <li key={friend.id}>
                  <label>
                    <input type="checkbox" checked={selectedFriends.includes(friend.id)} onChange={() => handleFriendSelection(friend.id)} />
                    {friend.username}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={handleCreateGroupChat}>Create Group Chat</button>
            <button onClick={() => setIsFriendListVisible(false)}>Cancel</button>
          </div>
        )}
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
            <h2>Select a chatroom to start chatting!</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
