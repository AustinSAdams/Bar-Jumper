"use client";

import { createContext, useState, useEffect } from 'react';
import { getAllDocuments } from '../api/firebase/firebase';

// Export the context
export const UsersContext = createContext();
// Export the provider
export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);

  // Upon reference of the provider, fetch all documents.
  useEffect(() => {
    async function fetchUsers() {
      try {
        const userDocs = await getAllDocuments('users');
        //console.log(userDocs);
        setUsers(userDocs);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    }
    fetchUsers();
  }, []);

  /* Used for error handling. After users is updated, it can be printed via this useEffect
  useEffect(() => {
    console.log(users);
  }, [users]);
  */

  return (
    <UsersContext.Provider value={{ users }}>
      {children}
    </UsersContext.Provider>
  );
}