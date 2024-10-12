import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, query} from "firebase/firestore";

// Set up firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "bar-jumpers.firebaseapp.com",
  databaseURL: "DATABASE_NAME.firebaseio.com",
  projectId: "bar-jumpers",
  storageBucket: "bar-jumpers.appspot.com",
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-X12D9E9RFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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