"use client";
/* This page is for the "/chats" extension on the website. It should have:
    1. Default Theme Colors.
    2. Easy to navigate menu.
    3. User sign in/up option.
    3. Buttons containing links to chatrooms with access restricted to registered users.

    To access this page locally, after running "npm run dev", go into your web browser
    and type in "http://localhost:3000/chats".
*/
import React from 'react';
import Chat from './Chat';

const chatrooms = [
    { id: 1, name: 'Dawg House' },
    { id: 2, name: 'The Revelry' },
    { id: 3, name: 'Sundown Tavern' },
    { id: 4, name: 'Ponchatoulas'},
    { id: 5, name: 'Bayou Axe Ruston'},
    { id: 6, name: 'Utility Brewing Co'}
];

export default function Page(){
    return (
    <div>
        <Chat chatrooms={chatrooms} />
    </div>
    );
}