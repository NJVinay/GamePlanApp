import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../utils/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
//ref: https://dev.to/zolomohan/react-native-firebase-email-password-authentication-3889
export default function StudentSignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    trainerID: '',
    sport: '',
    gender: '',
    emergencyContact: '',
    studentID: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const generateStudentID = () => {
    const generatedID = Math.floor(100000 + Math.random() * 900000).toString();
    handleInputChange('studentID', generatedID);
    Alert.alert('Student ID Generated', `Your Student ID is: ${generatedID}`);
  };

  const validateForm = () => {
    const {
      fullName,
      age,
      sport,
      gender,
      email,
      password,
      confirmPassword,
      trainerID,
      studentID,
      emergencyContact,
    } = formData;

    // Name validation
    if (!fullName || fullName.trim().length < 2) {
      setErrorMessage('Please enter a valid full name (at least 2 characters).');
      Alert.alert('Error', 'Please enter a valid full name (at least 2 characters).');
      return false;
    }

    // Age validation
    if (!age || isNaN(age) || parseInt(age) < 5 || parseInt(age) > 100) {
      setErrorMessage('Please enter a valid age (5-100).');
      Alert.alert('Error', 'Please enter a valid age (5-100).');
      return false;
    }

    // Gender validation
    if (!gender || gender === '') {
      setErrorMessage('Please select your gender.');
      Alert.alert('Error', 'Please select your gender.');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }

    // Password validation
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      Alert.alert('Error', 'Passwords do not match.');
      return false;
    }

    // Trainer ID validation
    if (!trainerID || trainerID.trim().length === 0) {
      setErrorMessage('Please enter your trainer ID.');
      Alert.alert('Error', 'Please enter your trainer ID.');
      return false;
    }

    // Student ID validation
    if (!studentID || studentID.trim().length === 0) {
      setErrorMessage('Please generate a student ID.');
      Alert.alert('Error', 'Please generate a student ID.');
      return false;
    }

    // Sport validation
    if (!sport || sport === '') {
      setErrorMessage('Please select a sport.');
      Alert.alert('Error', 'Please select a sport.');
      return false;
    }

    // Emergency contact validation
    if (emergencyContact && emergencyContact.length > 0 && (emergencyContact.length < 10 || isNaN(emergencyContact))) {
      setErrorMessage('Please enter a valid emergency contact number (at least 10 digits).');
      Alert.alert('Error', 'Please enter a valid emergency contact number (at least 10 digits).');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      // Query trainers collection to find trainer with matching trainerID field
      const trainersRef = collection(db, 'trainers');
      const q = query(trainersRef, where('trainerID', '==', formData.trainerID));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const errorMsg = 'Trainer ID not found. Please check and try again.';
        setErrorMessage(errorMsg);
        Alert.alert('Error', errorMsg);
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;


      const studentData = {
        name: formData.fullName,
        age: parseInt(formData.age, 10),
        email: formData.email,
        trainerID: formData.trainerID,
        studentID: formData.studentID,
        sport: formData.sport,
        gender: formData.gender,
        emergencyContact: formData.emergencyContact,
        image: 'https://via.placeholder.com/150',
      };

      await setDoc(doc(db, 'students', user.uid), studentData);

      Alert.alert('Success', 'Student account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error saving student data:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      let errorMsg = '';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already in use. Please use a different email.';
      } else if (error.code === 'permission-denied') {
        errorMsg = 'You do not have permission to perform this operation.';
      } else {
        errorMsg = `Failed to save data: ${error.code || error.message}`;
      }

      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Student Sign Up</Text>
        <Text style={styles.subheading}>
          Create your student profile and start your sports journey
        </Text>

        {/* Error Message Display */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#CCCCCC"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
        />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="#CCCCCC"
          value={formData.age}
          onChangeText={(value) => handleInputChange('age', value)}
          keyboardType="numeric"
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
            style={styles.picker}
            itemStyle={Platform.OS === 'ios' ? { color: '#000000' } : undefined}
          >
            <Picker.Item label="Select Gender" value="" color="#888888" />
            <Picker.Item label="Male" value="Male" color="#000000" />
            <Picker.Item label="Female" value="Female" color="#000000" />
            <Picker.Item label="Prefer not to say" value="Prefer not to say" color="#000000" />
          </Picker>
          <Text style={styles.pickerArrow}>▼</Text>
        </View>

        {/* Email Address */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#CCCCCC"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#CCCCCC"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
        />
        <Text style={styles.hintText}>Minimum 6 characters with letters and numbers</Text>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter your password"
          placeholderTextColor="#CCCCCC"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
        />

        {/* Trainer ID */}
        <Text style={styles.label}>Trainer ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your trainer ID"
          placeholderTextColor="#CCCCCC"
          value={formData.trainerID}
          onChangeText={(value) => handleInputChange('trainerID', value)}
        />

        {/* Student ID */}
        <Text style={styles.label}>Student ID</Text>
        <View style={styles.studentIDContainer}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: '#555555', color: '#AAAAAA' }]}
            value={formData.studentID}
            editable={false}
            placeholder="Student ID will be generated"
            placeholderTextColor="#CCCCCC"
          />
          <TouchableOpacity style={styles.generateButton} onPress={generateStudentID}>
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
        </View>

        {/* Sport */}
        <Text style={styles.label}>Sport</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.sport}
            onValueChange={(value) => handleInputChange('sport', value)}
            style={styles.picker}
            itemStyle={Platform.OS === 'ios' ? { color: '#000000' } : undefined}
          >
            <Picker.Item label="Select Sport" value="" color="#888888" />
            {['Badminton', 'Basketball', 'Cricket', 'Cycling', 'Football', 'Swimming'].map(
              (sportOption) => (
                <Picker.Item key={sportOption} label={sportOption} value={sportOption} color="#000000" />
              )
            )}
          </Picker>
          <Text style={styles.pickerArrow}>▼</Text>
        </View>

        {/* Emergency Contact */}
        <Text style={styles.label}>Emergency Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter emergency contact number"
          placeholderTextColor="#CCCCCC"
          value={formData.emergencyContact}
          onChangeText={(value) => handleInputChange('emergencyContact', value)}
          keyboardType="phone-pad"
        />

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Already Have an Account */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginRedirect}>Already have an account? Log in here.</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 20 },
  heading: { fontSize: 34, fontWeight: 'bold', color: '#EDEDED', textAlign: 'center', marginBottom: 10 },
  subheading: { fontSize: 18, textAlign: 'center', color: '#CCCCCC', marginBottom: 20 },
  errorContainer: { backgroundColor: '#FF4444', padding: 14, borderRadius: 10, marginBottom: 15 },
  errorText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center', fontWeight: '600' },
  label: { fontSize: 18, color: '#EDEDED', marginBottom: 8, fontWeight: '600' },
  hintText: { fontSize: 14, color: '#AAAAAA', marginTop: -15, marginBottom: 20, fontStyle: 'italic' },
  input: {
    borderWidth: 2,
    borderColor: '#555555',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    fontSize: 17,
  },
  studentIDContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  generateButton: { backgroundColor: '#DA0037', padding: 14, borderRadius: 10, marginLeft: 10 },
  generateButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 18 },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#1E1E1E',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden'
  },
  picker: {
    color: '#FFFFFF',
    height: 54,
    backgroundColor: '#1E1E1E',
    fontSize: 17,
    ...(Platform.OS === 'web' && {
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearning: 'none',
    })
  },
  pickerArrow: { position: 'absolute', right: 18, top: 18, color: '#EDEDED', fontSize: 18, pointerEvents: 'none', fontWeight: 'bold' },
  signupButton: { backgroundColor: '#DA0037', padding: 18, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
  signupButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  cancelButton: { borderWidth: 2, borderColor: '#CCCCCC', padding: 18, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  cancelButtonText: { color: '#CCCCCC', fontSize: 20, fontWeight: 'bold' },
  loginRedirect: { textAlign: 'center', color: '#DA0037', fontSize: 16, marginTop: 10, textDecorationLine: 'underline' },
});
