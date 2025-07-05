import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Fetch Attendance Data for a Student
 * @param {string} studentID - The ID of the student
 * @returns {Object} Attendance data mapped for calendar usage
 */
export const fetchAttendance = async (studentID) => {
  try {
    const studentDocRef = doc(db, 'students', studentID);
    const studentDoc = await getDoc(studentDocRef);

    if (studentDoc.exists()) {
      const attendance = studentDoc.data().attendance || {};
      return mapAttendanceToCalendar(attendance); // Map data to calendar format
    } else {
      throw new Error('Student data not found.');
    }
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};

/**
 * Mark Attendance for a Student
 * @param {string} studentID - The ID of the student
 */
export const markAttendance = async (studentID) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  try {
    const studentDocRef = doc(db, 'students', studentID);

    await updateDoc(studentDocRef, {
      [`attendance.${today}`]: { marked: true, timestamp: new Date().toISOString() },
    });

    console.log('Attendance marked successfully for', studentID);
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

/**
 * Map Attendance Data to Calendar Format
 * @param {Object} attendanceData - Attendance data from Firestore
 * @returns {Object} Mapped calendar data
 */
export const mapAttendanceToCalendar = (attendanceData) => {
  const calendarData = {};

  for (const [date, { marked }] of Object.entries(attendanceData)) {
    calendarData[date] = {
      marked,
      selected: marked,
      selectedColor: marked ? '#DA0037' : undefined,
    };
  }

  return calendarData;
};
