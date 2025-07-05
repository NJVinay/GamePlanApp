import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../../utils/firebaseConfig'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';


const TrainerContext = createContext();


export const TrainerProvider = ({ children }) => {
  const [trainerData, setTrainerData] = useState(null); 
  const [loading, setLoading] = useState(true); 


  const fetchTrainerData = async (uid) => {
    try {
      const docRef = doc(db, 'trainers', uid);
      const trainerDoc = await getDoc(docRef);

      if (trainerDoc.exists()) {
        setTrainerData(trainerDoc.data());
        console.log('Trainer data fetched successfully:', trainerDoc.data());
      } else {
        console.warn('Trainer data not found in Firestore.');
        setTrainerData(null);
      }
    } catch (error) {
      console.error('Error fetching trainer data:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const updateTrainerData = async (updatedFields) => {
    if (!auth.currentUser) {
      console.warn('No authenticated user. Cannot update trainer data.');
      return;
    }

    const uid = auth.currentUser.uid;

    try {
      const updatedTrainerData = { ...trainerData, ...updatedFields };
      setTrainerData(updatedTrainerData); 
      await setDoc(doc(db, 'trainers', uid), updatedTrainerData, { merge: true }); 
      console.log('Trainer data updated successfully in Firestore.');
    } catch (error) {
      console.error('Error updating trainer data:', error.message);
    }
  };

  const resetTrainerData = () => {
    setTrainerData(null);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed in. Fetching trainer data for UID:', user.uid);
        fetchTrainerData(user.uid);
      } else {
        console.log('User signed out. Resetting trainer data.');
        resetTrainerData();
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <TrainerContext.Provider value={{ trainerData, updateTrainerData, resetTrainerData, loading }}>
      {children}
    </TrainerContext.Provider>
  );
};
export const useTrainerContext = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainerContext must be used within a TrainerProvider');
  }
  return context;
};
