import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
//ref:https://www.freecodecamp.org/news/how-to-use-the-firebase-database-in-react/ 
const db = getFirestore();

export default function StudentProfileScreen({ route, navigation }) {
  const { student } = route.params || {};
  const [studentData, setStudentData] = useState(student || null);
  const [loading, setLoading] = useState(!student);
//ref: https://dev.to/itselftools/seamlessly-fetch-data-in-real-time-with-firebase-and-react-hooks-2g5
  useEffect(() => {
    if (!student) {
      const fetchStudentData = async () => {
        try {
          const studentDoc = await getDoc(doc(db, 'students', student.studentID));
          if (studentDoc.exists()) {
            setStudentData(studentDoc.data());
          } else {
            Alert.alert('Error', 'Student profile not found.');
            navigation.navigate('StudentDashboard');
          }
        } catch (error) {
          console.error('Error fetching student profile:', error);
          Alert.alert('Error', 'Failed to fetch student profile.');
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [student, navigation]);

  if (loading) {
    return (
      <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading student profile...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!studentData) {
    return (
      <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load student profile.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Settings Icon */}
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('StudentSettings', { student: studentData })}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          {studentData.profileImage ? (
            <Image
              source={{ uri: studentData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitial}>
                {studentData.name?.charAt(0).toUpperCase() || 'S'}
              </Text>
            </View>
          )}
          <Text style={styles.profileName}>{studentData.name || 'N/A'}</Text>
          <Text style={styles.profileId}>ID: {studentData.studentID || 'N/A'}</Text>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{studentData.email || 'N/A'}</Text>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{studentData.age || 'N/A'}</Text>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{studentData.gender || 'N/A'}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFFFFF', fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#DA0037', fontSize: 16, textAlign: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DA0037',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitial: { fontSize: 36, color: '#FFFFFF', fontWeight: 'bold' },
  profileName: { fontSize: 24, color: '#FFFFFF' },
  profileId: { fontSize: 16, color: '#CCCCCC' },
  sectionTitle: { fontSize: 18, color: '#DA0037', marginBottom: 10 },
  infoSection: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10 },
  infoLabel: { color: '#CCCCCC', marginBottom: 5 },
  infoValue: { color: '#FFFFFF', fontSize: 16 },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
