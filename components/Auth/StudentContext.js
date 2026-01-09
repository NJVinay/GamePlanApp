import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../../utils/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
//ref: https://milddev.com/react-createcontext 

const StudentContext = createContext();


export const StudentProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async (uid) => {
    try {
      const docRef = doc(db, 'students', uid);
      const studentDoc = await getDoc(docRef);

      if (studentDoc.exists()) {
        setStudentData(studentDoc.data());
        console.log('Student data fetched successfully:', studentDoc.data());
      } else {
        console.warn('Student data not found in Firestore.');
        setStudentData(null);
      }
    } catch (error) {
      console.error('Error fetching student data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentData = async (updatedFields) => {
    if (!auth.currentUser) {
      console.warn('No authenticated user. Cannot update student data.');
      return;
    }

    const uid = auth.currentUser.uid;

    try {
      const updatedStudent = { ...studentData, ...updatedFields };
      setStudentData(updatedStudent);
      await setDoc(doc(db, 'students', uid), updatedStudent, { merge: true });
      console.log('Student data updated successfully in Firestore.');
    } catch (error) {
      console.error('Error updating student data:', error.message);
      throw error;
    }
  };

  const resetStudentData = () => {
    setStudentData(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed in. Fetching student data for UID:', user.uid);
        fetchStudentData(user.uid);
      } else {
        console.log('User signed out. Resetting student data.');
        resetStudentData();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <StudentContext.Provider value={{ studentData, setStudentData, updateStudentData, resetStudentData, loading }}>
      {children}
    </StudentContext.Provider>
  );
};


export const useStudentContext = () => {
  return useContext(StudentContext);
};
