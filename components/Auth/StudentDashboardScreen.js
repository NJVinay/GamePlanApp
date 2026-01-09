import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'; //ref: https://codezup.com/react-native-geolocation-api-location-based-services
import { getDistance } from 'geolib'; //ref:https://devbrite.io/react-native-geolocation
import { Calendar } from 'react-native-calendars';

export default function StudentDashboardScreen({ navigation, route, trainerLocation }) {
  const { studentData } = route.params || {};
  const [tasks, setTasks] = useState({ Exercise: [], Practice: [] });
  const [selectedToggle, setSelectedToggle] = useState('Exercise');
  const [attendanceDates, setAttendanceDates] = useState({});
  const [streak, setStreak] = useState(0);
  const [lastSavedDate, setLastSavedDate] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [isInTargetLocation, setIsInTargetLocation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentData) {
      Alert.alert('Error', 'Student data is missing. Please log in again.');
      navigation.replace('Login');
      return;
    }

    const initializeDashboard = async () => {
      try {
        setLoading(true);
        await loadTasksAndAttendance();
        checkLocation(
          parseFloat(trainerLocation.latitude),
          parseFloat(trainerLocation.longitude),
          parseFloat(trainerLocation.radius)
        );
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        Alert.alert('Error', 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [studentData, trainerLocation]);

  const loadTasksAndAttendance = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const storedAttendanceDates = await AsyncStorage.getItem('attendanceDates');
      const storedStreak = await AsyncStorage.getItem('streak');
      const savedDate = await AsyncStorage.getItem('lastSavedDate');

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedAttendanceDates) setAttendanceDates(JSON.parse(storedAttendanceDates));
      if (storedStreak) setStreak(parseInt(storedStreak, 10));
      if (savedDate) setLastSavedDate(savedDate);
    } catch (error) {
      console.error('Error loading tasks or attendance:', error);
    }
  };
  //ref: 
  const checkLocation = async (latitude, longitude, radius) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to mark attendance.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const distance = getDistance(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude, longitude }
      );

      setIsInTargetLocation(distance <= radius);
    } catch (error) {
      console.error('Error checking location:', error);
    }
  };

  const handleAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (!attendanceMarked && isInTargetLocation) {
      setAttendanceMarked(true);

      try {
        const updatedDates = {
          ...attendanceDates,
          [today]: {
            selected: true,
            marked: true,
            selectedColor: '#DA0037',
          },
        };
        setAttendanceDates(updatedDates);
        await AsyncStorage.setItem('attendanceDates', JSON.stringify(updatedDates));

        Alert.alert('Success', 'Attendance marked successfully!');
      } catch (error) {
        console.error('Error marking attendance:', error);
        Alert.alert('Error', 'Failed to mark attendance.');
      }
    } else {
      Alert.alert('Error', 'You must be in the target location to mark attendance.');
    }
  };

  const saveProgress = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (lastSavedDate === today) {
      Alert.alert('Progress Saved', 'Progress saved successfully!');
    } else {
      if (
        tasks.Exercise.every((task) => task.completed) &&
        tasks.Practice.every((task) => task.completed)
      ) {
        setStreak((prevStreak) => prevStreak + 1);
        setLastSavedDate(today);
        try {
          await AsyncStorage.setItem('streak', (streak + 1).toString());
          await AsyncStorage.setItem('lastSavedDate', today);
          Alert.alert('Progress Saved', 'Progress saved successfully!');
        } catch (error) {
          Alert.alert('Error', 'Failed to save progress.');
        }
      } else {
        Alert.alert('Incomplete Tasks', 'Complete all tasks to save progress.');
      }
    }
  };

  const resetStreak = async () => {
    try {
      setStreak(0);
      await AsyncStorage.setItem('streak', '0');
      Alert.alert('Streak Reset', 'Your streak has been reset to 0.');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset streak.');
    }
  };

  const toggleTaskCompletion = (type, id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks[type].map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      const newTasks = { ...prevTasks, [type]: updatedTasks };
      AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      return newTasks;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA0037" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileInitialContainer}>
            <Text style={styles.profileInitial}>
              {studentData.name?.charAt(0).toUpperCase() || 'S'}
            </Text>
          </View>
          <Text style={styles.profileName}>{studentData.name || 'Student Name'}</Text>
          <Text style={styles.profileId}>ID: {studentData.studentID || 'N/A'}</Text>
        </View>

        {/* Go to Profile Button */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('StudentProfile', { student: studentData })}
        >
          <Text style={styles.profileButtonText}>Go to Profile</Text>
        </TouchableOpacity>

        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 Streak: {streak} days</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetStreak}>
            <Text style={styles.resetButtonText}>Reset Streak</Text>
          </TouchableOpacity>
        </View>

        <Calendar
          markedDates={attendanceDates}
          style={styles.calendar}
          theme={{
            calendarBackground: '#1E1E1E',
            textSectionTitleColor: '#DA0037',
            selectedDayBackgroundColor: '#DA0037',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#DA0037',
            dayTextColor: '#FFFFFF',
            textDisabledColor: '#555555',
            monthTextColor: '#FFFFFF',
            indicatorColor: '#DA0037',
          }}
        />

        <View style={styles.toggleContainer}>
          {['Exercise', 'Practice'].map((toggle) => (
            <TouchableOpacity
              key={toggle}
              style={[
                styles.toggleButton,
                selectedToggle === toggle && styles.activeToggleButton,
              ]}
              onPress={() => setSelectedToggle(toggle)}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedToggle === toggle && styles.activeToggleText,
                ]}
              >
                {toggle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{selectedToggle}</Text>
        {tasks[selectedToggle]?.map((task) => (
          <View
            key={task.id}
            style={[
              styles.taskItem,
              task.completed && styles.taskCompleted,
            ]}
          >
            <Checkbox
              status={task.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleTaskCompletion(selectedToggle, task.id)}
              color="#DA0037"
            />
            <Text
              style={[
                styles.taskName,
                task.completed && styles.taskCompletedText,
              ]}
            >
              {task.name}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.attendanceButton, attendanceMarked && styles.attendanceButtonDisabled]}
          onPress={handleAttendance}
          disabled={attendanceMarked}
        >
          <Text style={[styles.attendanceButtonText, attendanceMarked && styles.attendanceButtonTextDisabled]}>
            {attendanceMarked ? 'Attendance Marked' : 'Mark Attendance'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProgress}
        >
          <Text style={styles.saveButtonText}>Save Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFFFFF', marginTop: 10 },
  header: { alignItems: 'center', marginBottom: 20 },
  profileInitialContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DA0037',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { fontSize: 48, color: '#FFFFFF', fontWeight: 'bold' },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  profileId: { fontSize: 18, color: '#CCCCCC' },
  profileButton: {
    backgroundColor: '#DA0037',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 },
  streakBadge: { alignItems: 'center', marginVertical: 20 },
  streakText: { color: '#DA0037', fontSize: 18, fontWeight: 'bold' },
  resetButton: { marginTop: 10, paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#444444', borderRadius: 10 },
  resetButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  calendar: { marginBottom: 20 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeToggleButton: { backgroundColor: '#DA0037' },
  toggleText: { fontSize: 16, color: '#CCCCCC' },
  activeToggleText: { color: '#FFFFFF', fontWeight: 'bold' },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
  },
  taskCompleted: { backgroundColor: '#555555' },
  taskCompletedText: { color: '#CCCCCC', textDecorationLine: 'line-through' },
  taskName: { marginLeft: 10, fontSize: 16, color: '#FFFFFF' },
  attendanceButton: { backgroundColor: '#DA0037', padding: 15, borderRadius: 10 },
  attendanceButtonDisabled: { backgroundColor: '#CCCCCC' },
  attendanceButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
  attendanceButtonTextDisabled: { color: '#000000' },
  saveButton: { backgroundColor: '#DA0037', padding: 15, borderRadius: 10, marginTop: 20 },
  saveButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
});
