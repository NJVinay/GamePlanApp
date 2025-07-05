import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStudentContext } from './StudentContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function StudentSettingsScreen({ navigation }) {
  const { studentData, setStudentData } = useStudentContext();

  const [name, setName] = useState(studentData?.name || '');
  const [age, setAge] = useState(studentData?.age ? studentData.age.toString() : '');
  const [gender, setGender] = useState(studentData?.gender || '');
  const [email, setEmail] = useState(studentData?.email || '');
  const [address, setAddress] = useState(studentData?.address || '');
  const [trainerId, setTrainerId] = useState(studentData?.trainerID || '');
  const [trainerName, setTrainerName] = useState(studentData?.trainerName || '');
  const [sport, setSport] = useState(studentData?.sport || '');
  const [emergencyContact, setEmergencyContact] = useState(studentData?.emergencyContact || '');

  useEffect(() => {
    if (!studentData) {
      Alert.alert(
        'Warning',
        'Student data is missing. Default values will be used until data is updated.'
      );
    }
  }, [studentData]);

  const saveChanges = async () => {
    if (!name || !age || !gender) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const updatedStudent = {
      ...studentData,
      name,
      age: parseInt(age, 10),
      gender,
      email,
      address,
      trainerID: trainerId,
      trainerName,
      sport,
      emergencyContact,
    };

    try {
      await AsyncStorage.setItem('studentData', JSON.stringify(updatedStudent));
      setStudentData(updatedStudent);

      
      setName('');
      setAge('');
      setGender('');
      setEmail('');
      setAddress('');
      setTrainerId('');
      setTrainerName('');
      setSport('');
      setEmergencyContact('');

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#AAAAAA"
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            placeholderTextColor="#AAAAAA"
          />
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#AAAAAA"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#AAAAAA"
          />
          <TextInput
            style={styles.input}
            placeholder="Emergency Contact"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            keyboardType="phone-pad"
            placeholderTextColor="#AAAAAA"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trainer Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Trainer ID"
            value={trainerId}
            onChangeText={setTrainerId}
            placeholderTextColor="#AAAAAA"
          />
          <TextInput
            style={styles.input}
            placeholder="Trainer Name"
            value={trainerName}
            onChangeText={setTrainerName}
            placeholderTextColor="#AAAAAA"
          />
          <TextInput
            style={styles.input}
            placeholder="Sport"
            value={sport}
            onChangeText={setSport}
            placeholderTextColor="#AAAAAA"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20 },
  title: { fontSize: 24, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#DA0037', marginBottom: 10 },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#333333',
    borderWidth: 1,
  },
  picker: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    marginBottom: 15,
    borderRadius: 8,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    backgroundColor: '#444444',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#DA0037',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  saveButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
});
