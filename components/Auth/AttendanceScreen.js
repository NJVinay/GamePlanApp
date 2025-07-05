import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';

export default function AttendanceScreen({ route }) {
  const { studentID } = route.params;
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentDocRef = doc(db, 'students', studentID);
        const studentDoc = await getDoc(studentDocRef);

        if (studentDoc.exists()) {
          const attendance = studentDoc.data().attendance || {};
          setAttendanceData(mapAttendanceToCalendar(attendance));
        } else {
          Alert.alert('Error', 'Student data not found.');
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        Alert.alert('Error', 'Failed to load attendance data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentID]);
  //ref: https://www.npmjs.com/package/react-native-calendars
  const mapAttendanceToCalendar = (attendance) => {
    const calendarData = {};

    Object.keys(attendance).forEach((date) => {
      calendarData[date] = {
        marked: attendance[date]?.marked || false,
        selected: attendance[date]?.marked || false,
        selectedColor: attendance[date]?.marked ? '#DA0037' : undefined,
      };
    });

    return calendarData;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA0037" />
      </View>
    );
  }
//ref: https://www.awesomereactnative.com/period-marking/
  return (
    <View style={styles.container}>
      <Calendar
        markedDates={attendanceData}
        theme={{
          calendarBackground: '#171717',
          textSectionTitleColor: '#DA0037',
          dayTextColor: '#FFFFFF',
          todayTextColor: '#DA0037',
          arrowColor: '#DA0037',
          monthTextColor: '#FFFFFF',
          selectedDayBackgroundColor: '#DA0037',
          selectedDayTextColor: '#FFFFFF',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171717', justifyContent: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
