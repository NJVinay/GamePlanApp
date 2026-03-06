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
import { theme } from '../../utils/theme';
import { useStudentContext } from './StudentContext';
import { auth } from '../../utils/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function StudentDashboardScreen({ navigation, trainerLocation }) {
  const { studentData } = useStudentContext();
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

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
            selectedColor: theme.colors.primary,
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
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surfaceLight]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1, alignItems: 'center', paddingLeft: 30 }}>
            <View style={styles.profileInitialContainer}>
              <Text style={styles.profileInitial}>
                {studentData.name?.charAt(0).toUpperCase() || 'S'}
              </Text>
            </View>
            <Text style={styles.profileName}>{studentData.name || 'Student Name'}</Text>
            <Text style={styles.profileId}>ID: {studentData.studentID || 'N/A'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
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
            calendarBackground: theme.colors.surface,
            textSectionTitleColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: theme.colors.text,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.text,
            textDisabledColor: theme.colors.textMuted,
            monthTextColor: theme.colors.text,
            indicatorColor: theme.colors.primary,
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
              color={theme.colors.primary}
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
  container: { flexGrow: 1, padding: theme.spacing.lg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: theme.colors.text, marginTop: theme.spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.lg },
  profileInitialContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { fontSize: 48, color: theme.colors.text, fontWeight: theme.typography.weight.bold },
  profileName: { fontSize: theme.typography.size.xl, fontWeight: theme.typography.weight.bold, color: theme.colors.text },
  profileId: { fontSize: theme.typography.size.md, color: theme.colors.textSecondary },
  logoutButton: { padding: theme.spacing.sm },
  profileButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  profileButtonText: { color: theme.colors.text, fontWeight: theme.typography.weight.bold, fontSize: theme.typography.size.md },
  streakBadge: { alignItems: 'center', marginVertical: theme.spacing.lg },
  streakText: { color: theme.colors.primary, fontSize: theme.typography.size.md, fontWeight: theme.typography.weight.bold },
  resetButton: { marginTop: theme.spacing.sm, paddingHorizontal: 18, paddingVertical: 8, backgroundColor: theme.colors.surfaceLight, borderRadius: theme.borderRadius.md },
  resetButtonText: { color: theme.colors.text, fontSize: theme.typography.size.md, fontWeight: theme.typography.weight.bold },
  calendar: { marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius.md, overflow: 'hidden', ...theme.shadows.sm },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: theme.spacing.lg },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  activeToggleButton: { backgroundColor: theme.colors.primary },
  toggleText: { fontSize: theme.typography.size.md, color: theme.colors.textSecondary },
  activeToggleText: { color: theme.colors.text, fontWeight: theme.typography.weight.bold },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  taskCompleted: { backgroundColor: theme.colors.surfaceLight },
  taskCompletedText: { color: theme.colors.textSecondary, textDecorationLine: 'line-through' },
  taskName: { marginLeft: 10, fontSize: theme.typography.size.md, color: theme.colors.text },
  attendanceButton: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: theme.borderRadius.md, ...theme.shadows.md },
  attendanceButtonDisabled: { backgroundColor: theme.colors.textSecondary, ...theme.shadows.sm },
  attendanceButtonText: { color: theme.colors.text, textAlign: 'center', fontWeight: theme.typography.weight.bold },
  attendanceButtonTextDisabled: { color: theme.colors.background },
  saveButton: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: theme.borderRadius.md, marginTop: theme.spacing.lg, ...theme.shadows.lg },
  saveButtonText: { color: theme.colors.text, textAlign: 'center', fontWeight: theme.typography.weight.bold },
});
