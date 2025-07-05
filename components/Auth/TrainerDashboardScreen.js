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

export default function TrainerDashboardScreen({ navigation, route }) {
  const { trainerData } = route.params || {};
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
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
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
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#CCCCCC" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ID..."
            placeholderTextColor="#CCCCCC"
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  profileTouchable: { alignItems: 'center' },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitial: { fontSize: 36, color: '#FFFFFF', fontWeight: 'bold' },
  trainerName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  trainerId: { fontSize: 16, color: '#CCCCCC' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#DA0037', marginBottom: 10 },
  errorContainer: { alignItems: 'center', padding: 20, marginTop: 20 },
  errorText: { fontSize: 16, color: '#CCCCCC', textAlign: 'center' },
  studentList: { paddingBottom: 20 },
  emptySearchText: { color: '#CCCCCC', fontSize: 16, textAlign: 'center', marginTop: 20 },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  studentImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DA0037',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  studentImageInitial: { fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' },
  studentDetails: { flex: 1 },
  studentName: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
  studentRole: { fontSize: 14, color: '#CCCCCC' },
  studentID: { fontSize: 12, color: '#AAAAAA' },
  streakBadge: {
    marginTop: 5,
    backgroundColor: '#333333',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  streakText: { fontSize: 12, color: '#FFFFFF' },
});
