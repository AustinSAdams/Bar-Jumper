import { db, auth, storage } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, updateProfile, updatePassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
   
    const storageRef = ref(storage, `defaultUserImage.png`);
    const downloadUrl = await getDownloadURL(storageRef);

    await updateProfile(user, {
      displayName: username,
      photoURL: downloadUrl,
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

export async function uploadImage(file) {
  const user = auth.currentUser;
  if(!file){
    return null;
  }
  const storageRef = ref(storage, `images/${file.name}`);
  try{
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    await updateProfile(user, {
      photoURL: downloadUrl
    });
  } catch(err){
    console.error("Error Uploading File:",err);
    throw new CustomError("Could Not Upload Photo");
  }
}

export async function updateUserDisplayName(newDisplayName){
  const user = auth.currentUser;
  try{
    await updateProfile(user, {
      displayName: newDisplayName
    });
  }catch(err){
    console.error(err);
    throw new CustomError("Error updating username.");
  }
}

export async function updateUserPassword(newPassword){
  const user = auth.currentUser;
  try{
    await updatePassword(user, newPassword);
  }catch(err){
    console.error(err);
    throw new CustomError("Error updating password.");
  }
}