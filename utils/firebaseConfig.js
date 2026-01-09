import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
}; 

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase instances - handle web vs native auth persistence
let auth;
try {
  if (Platform.OS === 'web') {
    // For web, try to get existing auth or initialize with browser persistence
    try {
      auth = getAuth(app);
    } catch {
      auth = initializeAuth(app, {
        persistence: browserLocalPersistence,
      });
    }
  } else {
    // For mobile, use AsyncStorage persistence
    try {
      auth = getAuth(app);
    } catch {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  }
} catch (error) {
  console.error('Firebase auth initialization error:', error);
  // Fallback to just getting auth
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication Functions

/**
 * Sign In
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in successfully:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

/**
 * Sign Out
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

/**
 * Reset Password
 * @param {string} email - User email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent!');
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw error;
  }
};

// Firestore Functions

/**
 * Add Trainer Data
 * @param {string} uid - Trainer's Firebase Authentication UID
 * @param {Object} trainerData - Trainer data to save
 */
export const addTrainer = async (uid, trainerData) => {
  try {
    await setDoc(doc(db, 'trainers', uid), trainerData);
    console.log('Trainer data saved successfully.');
  } catch (error) {
    console.error('Error adding trainer data:', error.message);
    throw error;
  }
};

/**
 * Fetch Trainer Data
 * @param {string} uid - Trainer's Firebase Authentication UID
 * @returns {Object} Trainer data
 */
export const fetchTrainer = async (uid) => {
  try {
    const docRef = doc(db, 'trainers', uid);
    const trainerDoc = await getDoc(docRef);

    if (trainerDoc.exists()) {
      console.log('Trainer data fetched successfully:', trainerDoc.data());
      return trainerDoc.data();
    } else {
      throw new Error('Trainer not found.');
    }
  } catch (error) {
    console.error('Error fetching trainer data:', error.message);
    throw error;
  }
};

/**
 * Add Student Data
 * @param {Object} studentData - Student data to save
 */
export const addStudent = async (studentData) => {
  try {
    const studentRef = doc(collection(db, 'students'));
    await setDoc(studentRef, studentData);
    console.log('Student added successfully:', studentRef.id);
    return studentRef.id;
  } catch (error) {
    console.error('Error adding student data:', error.message);
    throw error;
  }
};

/**
 * Fetch All Students for a Trainer
 * @param {string} trainerID - Trainer ID to fetch students
 * @returns {Array} List of students
 */
export const fetchStudentsForTrainer = async (trainerID) => {
  try {
    const studentsSnapshot = await getDocs(
      query(collection(db, 'students'), where('trainerID', '==', trainerID))
    );
    return studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching students:', error.message);
    throw error;
  }
};

/**
 * Update Trainer Data
 * @param {string} uid - Trainer's Firebase Authentication UID
 * @param {Object} updatedData - Updated trainer data
 */
export const updateTrainer = async (uid, updatedData) => {
  try {
    await updateDoc(doc(db, 'trainers', uid), updatedData);
    console.log('Trainer data updated successfully.');
  } catch (error) {
    console.error('Error updating trainer data:', error.message);
    throw error;
  }
};

/**
 * Update Student Data
 * @param {string} studentID - Student ID
 * @param {Object} updatedData - Updated student data
 */
export const updateStudent = async (studentID, updatedData) => {
  try {
    const studentDoc = doc(db, 'students', studentID);
    await updateDoc(studentDoc, updatedData);
    console.log('Student updated successfully.');
  } catch (error) {
    console.error('Error updating student data:', error.message);
    throw error;
  }
};

/**
 * Listen to Real-Time Student Updates
 * @param {Function} callback - Callback to handle updates
 */
export const listenToStudents = (callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const students = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(students);
    });

    return unsubscribe; // Call this function to stop listening
  } catch (error) {
    console.error('Error listening to students:', error.message);
    throw error;
  }
};

/**
 * Upload File to Firebase Storage
 * @param {Object} file - File object with `uri` and `name`
 * @returns {string} File's public URL
 */
export const uploadFile = async (file) => {
  try {
    const response = await fetch(file.uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `uploads/${file.name}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
};
