import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { theme } from '../../utils/theme';
import { useTrainerContext } from './TrainerContext';
import { auth } from '../../utils/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function TrainerDashboardScreen({ navigation }) {
  const { trainerData } = useTrainerContext();
  const trainerID = trainerData?.trainerID || '';
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!trainerID) {
      Alert.alert('Error', 'Trainer ID is missing. Please log in again.');
      navigation.replace('Login');
      return;
    }
    //ref:https://thelinuxcode.com/how-to-build-a-react-native-flatlist-with-realtime-searching-ability/ 
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('trainerID', '==', trainerID));
        const querySnapshot = await getDocs(q);

        const studentsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          streak: doc.data()?.streak || 0,
        }));


        const uniqueStudents = Array.from(new Map(studentsData.map((s) => [s.id, s])).values());

        if (uniqueStudents.length === 0) {
          setErrorMessage('No students found. Ask students to join using your Trainer ID.');
        } else {
          setStudents(uniqueStudents);
          setErrorMessage('');
        }
      } catch (error) {
        console.error('Error fetching students:', error.message);
        setErrorMessage('Failed to fetch students. Please try again later.');
      }
    };

    fetchStudents();
  }, [trainerID]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const filteredStudents = students.filter((student) =>
    [student.name, student.studentID]
      .some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderStudentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => navigation.navigate('StudentPage', { student: item })}
    >
      <View style={styles.studentImageContainer}>
        <Text style={styles.studentImageInitial}>
          {item.name?.charAt(0).toUpperCase() || 'S'}
        </Text>
      </View>
      <View style={styles.studentDetails}>
        <Text style={styles.studentName}>{item.name || 'Student Name'}</Text>
        <Text style={styles.studentRole}>{item.sport || 'Sport'}</Text>
        <Text style={styles.studentID}>ID: {item.studentID || 'N/A'}</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 Streak: {item.streak || 0} days</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surfaceLight]} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TrainerProfile', { trainerData })}
            style={styles.profileTouchable}
          >
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitial}>
                {trainerData?.name?.charAt(0).toUpperCase() || 'T'}
              </Text>
            </View>
            <Text style={styles.trainerName}>{trainerData?.name || 'Trainer'}</Text>
            <Text style={styles.trainerId}>ID: {trainerID}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ID..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>Students List</Text>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item, index) =>
              item.id ? `student-${item.id}` : `fallback-${index}`//ref:https://trycatchdebug.net/news/1168312/firestore-query-in-react-native
            }
            renderItem={renderStudentCard}
            contentContainerStyle={styles.studentList}
            ListEmptyComponent={
              searchQuery ? (
                <Text style={styles.emptySearchText}>
                  No results found for "{searchQuery}".
                </Text>
              ) : null
            }
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.lg },
  profileTouchable: { alignItems: 'center', flex: 1 },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  profileInitial: { fontSize: 36, color: theme.colors.text, fontWeight: theme.typography.weight.bold },
  trainerName: { fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.bold, color: theme.colors.text },
  trainerId: { fontSize: theme.typography.size.md, color: theme.colors.textSecondary },
  logoutButton: { padding: theme.spacing.sm },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  searchInput: { flex: 1, color: theme.colors.text, fontSize: theme.typography.size.md, marginLeft: theme.spacing.sm },
  sectionTitle: { fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.bold, color: theme.colors.primary, marginBottom: theme.spacing.sm },
  errorContainer: { alignItems: 'center', padding: theme.spacing.lg, marginTop: theme.spacing.lg },
  errorText: { fontSize: theme.typography.size.md, color: theme.colors.textSecondary, textAlign: 'center' },
  studentList: { paddingBottom: theme.spacing.lg },
  emptySearchText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.md, textAlign: 'center', marginTop: theme.spacing.lg },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  studentImageContainer: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  studentImageInitial: { fontSize: 24, color: theme.colors.text, fontWeight: theme.typography.weight.bold },
  studentDetails: { flex: 1 },
  studentName: { fontSize: theme.typography.size.lg, color: theme.colors.text, fontWeight: theme.typography.weight.bold },
  studentRole: { fontSize: theme.typography.size.md, color: theme.colors.textSecondary },
  studentID: { fontSize: theme.typography.size.sm, color: theme.colors.textMuted },
  streakBadge: {
    marginTop: 5,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  streakText: { fontSize: theme.typography.size.sm, color: theme.colors.text },
});
