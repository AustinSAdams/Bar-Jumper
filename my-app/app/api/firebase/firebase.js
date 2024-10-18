import { db, auth } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc, query } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, updateProfile, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";

class CustomError extends Error {
  constructor(message){
    super(message);
    this.name = "Error"
  }
}
export { CustomError };

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
    throw new CustomError('Failed to fetch documents.');
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
    console.error("Error Creating Account:", err);
    throw new CustomError("Email Already In Use");
  }
}

export async function loginWithCredentials(email, password) {
  try{
    await signInWithEmailAndPassword(auth, email, password);
  }catch (err){
    console.error("Error Logging Into Account:", err);
    throw new CustomError("Invalid Credentials");
  }
}

export async function logUserOut() {
  try{
    await signOut(auth);
  }catch(err){
    console.error("Error signing out:",err);
    throw new CustomError("Could Not Safely Logout.");
  }
}