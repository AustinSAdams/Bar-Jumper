import { collection, getDocs, getFirestore } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Set up firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCx6y7OzvlE5ZcfNPjlJf2Xn2xRngrJoeo',
  authDomain: "bar-jumpers.firebaseapp.com",
  databaseURL: "DATABASE_NAME.firebaseio.com",
  projectId: "bar-jumpers",
  storageBucket: "bar-jumpers.appspot.com",
  messagingSenderId: '831688467414',
  appId: '1:831688467414:web:0b5d2f0f001ddb948dfa77',
  measurementId: "G-X12D9E9RFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function used to retrieve and return all documents. Takes a collection name as a parameter
export async function getAllDocuments(colName) {
  try{
    const querySnapshot = await getDocs(collection(db, colName));
    const documents = [];

    querySnapshot.forEach((doc) => {
        documents.push({id: doc.id, ...doc.data()});
    });
    //console.log(documents);
    return documents;
  } catch(err){
    // if documents don't exist, throw an error.
    console.error("Error:",err);
    throw new Error('Failed to fetch documents');
  }
}

export async function createAccount(email, password, username) {
  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username,
    });

    return user;
  } catch(err) {
    console.error("Error Creating Account", err);
    throw new Error(err.message);
  }
}

export async function loginWithCredentials(email, password) {
  try{
    await signInWithEmailAndPassword(auth, email, password);

    console.log("USER:", auth.currentUser);
  }catch (err){
    console.error("Error Logging Into Account", err);
  }
}

export async function logUserOut() {
  try{
    await signOut(auth);
  }catch(err){
    console.error("Error signing out:",err);
  }
}