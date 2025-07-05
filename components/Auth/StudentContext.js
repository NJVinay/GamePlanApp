import React, { createContext, useState, useContext } from 'react';
//ref: https://milddev.com/react-createcontext 

const StudentContext = createContext();


export const StudentProvider = ({ children }) => {
  const [studentData, setStudentData] = useState({
    studentID: '',
    name: '',
    image: 'https://via.placeholder.com/150',
    age: '',
    gender: '',
    email: '',
    address: '',
    trainerID: '',
    trainerName: '',
    sport: '',
    emergencyContact: '',
    tasks: { Exercise: [], Practice: [] },
    attendanceDates: {},
    streak: 0,
  });


  const updateStudentData = (updatedFields) => {
    setStudentData((prevData) => ({ ...prevData, ...updatedFields }));
  };

  return (
    <StudentContext.Provider value={{ studentData, setStudentData, updateStudentData }}>
      {children}
    </StudentContext.Provider>
  );
};


export const useStudentContext = () => {
  return useContext(StudentContext);
};
