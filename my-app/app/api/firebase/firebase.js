import { db, auth, storage, serverTimestamp } from "./firebaseConfig";
import { collection, getDocs, setDoc, doc, deleteDoc, arrayUnion, updateDoc, arrayRemove, query, where } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, updateProfile, updatePassword, signInWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";

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
    throw new CustomError('Failed to fetch documents.');
  }
}

export async function createAccount(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const storageRef = ref(storage, `defaultUserImage.png`);
    const downloadUrl = await getDownloadURL(storageRef);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      username: username,
      email: email,
      photoUrl: downloadUrl,
      friendsList: [],
      birthday: null, 
      phoneNumber: null,
      gender: null,
      visibility: 'visible'
    });
    await updateProfile(user, {
      displayName: username,
      photoURL: downloadUrl,
    });
    return user;
  } catch (err) {
    throw new CustomError("Email Already In Use");
  }
}

export async function deleteAuthAccount(uid) {
  const user = auth.currentUser;
  if (user.uid !== uid) {
    throw new CustomError("User not authenticated or mismatched UID.");
  }
  const userDocRef = doc(db, 'users', uid);
  try{
    const querySnapshot = await getDocs(
      query(collection(db, 'users'), where('friendsList', 'array-contains', userDocRef))
    );

    const removePromises = querySnapshot.docs.map((docSnap) =>
      updateDoc(doc(db, 'users', docSnap.id), {
        friendsList: arrayRemove(userDocRef)
      })
    );
    await Promise.all(removePromises);

    await deleteDoc(userDocRef);

    await deleteFolderContents(`ProfilePics/${uid}`);
    await deleteUser(user);
  }catch(err) {
    throw new CustomError("Cannot delete account.");
  }
}

async function deleteFolderContents(path){
  const folderRef = ref(storage, path);
  try{
    const listResult = await listAll(folderRef);

    const deletePromises = listResult.items.map((fileRef) => deleteObject(fileRef));
    await Promise.all(deletePromises);
  }catch(err) {
    throw new CustomError("Cannot delete folder contents.");
  }
}

export async function loginWithCredentials(email, password) {
  try{
    await signInWithEmailAndPassword(auth, email, password);
  }catch (err){
    throw new CustomError("Invalid Credentials");
  }
}

export async function logUserOut() {
  const user = auth.currentUser;
  if (!user) {
    throw new CustomError("No User Signed In");
  }

  const userStatusFirestoreRef = doc(db, 'users', user.uid);
  await updateDoc(userStatusFirestoreRef, {
    state: 'offline',
    last_changed: serverTimestamp(),
  });

  try {
    await signOut(auth);
  } catch (err) {
    throw new CustomError("Could Not Safely Logout.");
  }
}

export async function uploadImage(file) {
  const user = auth.currentUser;
  if(!file){
    return null;
  }
  const storageRef = ref(storage, `ProfilePics/${user.uid}/${file.name}`);
  try{
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    await updateProfile(user, {
      photoURL: downloadUrl
    });

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      photoUrl: downloadUrl
    });

  } catch(err){
    throw new CustomError("Could Not Upload Photo");
  }
}

export async function updateUserDisplayName(newDisplayName){
  const user = auth.currentUser;
  try{
    await updateProfile(user, {
      displayName: newDisplayName
    });

    const userDoc = doc(db, 'users', user.uid);
    await updateDoc(userDoc, {
      username: newDisplayName
    });

  }catch(err){
    throw new CustomError("Error updating username.");
  }
}

export async function updateUserPassword(newPassword){
  const user = auth.currentUser;
  if (!user) {
    throw new CustomError("No User Signed In");
  }
  try{
    await updatePassword(user, newPassword);
  }catch(err){
    throw new CustomError("Error updating password.");
  }
}

export async function addFriend(friendUid) {
  const userId = auth.currentUser.uid;
  try{
    const userDoc = doc(db, 'users', userId);
    const friendDoc = doc(db, 'users', friendUid);
    
    await Promise.all([
      await updateDoc(userDoc, {
        friendsList: arrayUnion(friendDoc)
      }),
      await updateDoc(friendDoc, {
        friendsList: arrayUnion(userDoc)
      })
    ]);

  }catch(err) {
    throw new CustomError("Could not add friend.");
  }
}

export async function removeFriend(friendUid) {
  const userId = auth.currentUser.uid;
  try{
    const userDoc = doc(db, 'users', userId);
    const friendDoc = doc(db, 'users', friendUid);
    
    Promise.all([
      updateDoc(userDoc, {
        friendsList: arrayRemove(friendDoc)
      }),
      updateDoc(friendDoc, {
        friendsList: arrayRemove(userDoc)
      })
    ]);
  }catch(err) {
    throw new CustomError("Could not remove friend.");
  }
}

export async function updateUserBirthday(newBirthday) {
  const user = auth.currentUser;
  if (!user) {
    throw new CustomError("No User Signed In");
  }
  try {
    const userDoc = doc(db, 'users', user.uid);
    await updateDoc(userDoc, {
      birthday: newBirthday
    });
  } catch (err) {
    throw new CustomError("Error updating birthday.");
  }
}

export async function updateUserPhoneNumber(newPhoneNumber) {
  const user = auth.currentUser;
  if (!user) {
    throw new CustomError("No User Signed In");
  }
  try {
    const userDoc = doc(db, 'users', user.uid);
    await updateDoc(userDoc, {
      phoneNumber: newPhoneNumber
    });
  } catch (err) {
    throw new CustomError("Error updating phone number.");
  }
}

export async function updateUserGender(newGender) {
  const user = auth.currentUser;
  if (!user) {
    throw new CustomError("No User Signed In");
  }
  try {
    const userDoc = doc(db, 'users', user.uid);
    await updateDoc(userDoc, {
      gender: newGender
    });
  } catch (err) {
    throw new CustomError("Error updating gender.");
  }
}

export async function updateUserVisibility(status) {
  const user = auth.currentUser;
  try {
    const userDoc = doc(db, 'users', user.uid);
    await updateDoc(userDoc, {
      visibility: status
    });
  }catch (err) {
    throw new CustomError("Error updating visibility!");
  }
}