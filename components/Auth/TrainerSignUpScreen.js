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
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../utils/firebaseConfig'; //ref: https://codezup.com/react-native-firebase-auth-realtime-database/
import { doc, setDoc } from 'firebase/firestore';
export default function TrainerSignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sports, setSports] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [experience, setExperience] = useState('');
  const [trainerID, setTrainerID] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleGenerateTrainerID = () => {
    const newID = 'TR' + Math.floor(100000 + Math.random() * 900000);
    setTrainerID(newID);
    Alert.alert('Trainer ID Generated', `Your Trainer ID: ${newID}`);
  };


  const handleSignUp = async () => {
    // Field presence validation
    if (!name || name.trim().length < 2) {
      const errorMsg = 'Please enter a valid name (at least 2 characters).';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (!age || isNaN(age) || parseInt(age) < 18 || parseInt(age) > 100) {
      const errorMsg = 'Please enter a valid age (18-100).';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (!sports || sports === '') {
      const errorMsg = 'Please select a sport.';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (!gender || gender === '') {
      const errorMsg = 'Please select your gender.';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      const errorMsg = 'Please enter a valid email address.';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (!password || password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long.';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      const errorMsg = 'Passwords do not match.';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (!latitude || isNaN(latitude) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90) {
      const errorMsg = 'Please enter a valid latitude (-90 to 90).';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (!longitude || isNaN(longitude) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
      const errorMsg = 'Please enter a valid longitude (-180 to 180).';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (mobile && mobile.length > 0 && (mobile.length < 10 || isNaN(mobile))) {
      const errorMsg = 'Please enter a valid mobile number (at least 10 digits).';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (experience && (isNaN(experience) || parseInt(experience) < 0 || parseInt(experience) > 50)) {
      const errorMsg = 'Please enter valid years of experience (0-50).';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    if (!trainerID) {
      const errorMsg = 'Please generate a Trainer ID first.';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const trainerData = {
        name,
        age: parseInt(age, 10),
        sports,
        mobile,
        email,
        gender,
        aboutMe,
        experience: parseInt(experience, 10),
        trainerID,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radius: radius ? parseFloat(radius) : 100,
        },
        profileImage: 'https://via.placeholder.com/150',
      };


      await setDoc(doc(db, 'trainers', user.uid), trainerData);

      Alert.alert('Success', 'Trainer account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error creating trainer account:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      let errorMsg = '';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please log in instead.';
        Alert.alert('Error', errorMsg, [
          { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
          { text: 'Cancel', style: 'cancel' }
        ]);
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak. Please use at least 6 characters with letters and numbers.';
        Alert.alert('Error', errorMsg);
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email format. Please check your email address.';
        Alert.alert('Error', errorMsg);
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMsg = 'Email/password accounts are not enabled. Please contact support.';
        Alert.alert('Error', errorMsg);
      } else {
        errorMsg = `Failed to create account: ${error.message}`;
        Alert.alert('Error', errorMsg);
      }
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Trainer Sign Up</Text>

        {/* Error Message Display */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#CCCCCC"
          value={name}
          onChangeText={setName}
        />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="#CCCCCC"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        {/* Google Maps Button */}
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => Linking.openURL('https://www.google.com/maps')}
        >
          <Text style={styles.mapButtonText}>Know Your Location</Text>
        </TouchableOpacity>

        {/* Description Below Maps Button */}
        <Text style={styles.mapDescription}>
          Spot your precise location on the map. (Tap and hold the target icon to see latitudes and longitudes.)
        </Text>

        {/* Latitude */}
        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter latitude"
          placeholderTextColor="#CCCCCC"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />

        {/* Longitude */}
        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter longitude"
          placeholderTextColor="#CCCCCC"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />

        {/* Sports */}
        <Text style={styles.label}>Sports</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sports}
            onValueChange={(itemValue) => setSports(itemValue)}
            style={styles.picker}
            dropdownIconColor="#EDEDED"
            itemStyle={Platform.OS === 'ios' ? { color: '#000000' } : undefined}
          >
            <Picker.Item label="Select Sports" value="" color="#888888" />
            {['Badminton', 'Basketball', 'Cricket', 'Cycling', 'Football', 'Swimming', 'Volleyball'].map((sport) => (
              <Picker.Item key={sport} label={sport} value={sport} color="#000000" />
            ))}
          </Picker>
          <Text style={styles.pickerArrow}>▼</Text>
        </View>

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
            dropdownIconColor="#EDEDED"
            itemStyle={Platform.OS === 'ios' ? { color: '#000000' } : undefined}
          >
            <Picker.Item label="Select Gender" value="" color="#888888" />
            <Picker.Item label="Male" value="Male" color="#000000" />
            <Picker.Item label="Female" value="Female" color="#000000" />
            <Picker.Item label="Prefer not to say" value="Prefer not to say" color="#000000" />
          </Picker>
          <Text style={styles.pickerArrow}>▼</Text>
        </View>

        {/* Mobile */}
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#CCCCCC"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#CCCCCC"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.hintText}>Minimum 6 characters with letters and numbers</Text>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#CCCCCC"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* About Me */}
        <Text style={styles.label}>About Me</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Write a short bio"
          placeholderTextColor="#CCCCCC"
          value={aboutMe}
          onChangeText={setAboutMe}
          multiline
        />

        {/* Experience */}
        <Text style={styles.label}>Experience</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter years of experience"
          placeholderTextColor="#CCCCCC"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
        />

        {/* Generate Trainer ID */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateTrainerID}
        >
          <Text style={styles.generateButtonText}>Generate Trainer ID</Text>
        </TouchableOpacity>

        {/* Trainer ID */}
        <Text style={styles.label}>Trainer ID</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={trainerID}
          editable={false}
        />

        {/* Sign Up */}
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
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 20 },
  heading: { fontSize: 34, fontWeight: 'bold', color: '#EDEDED', textAlign: 'center', marginBottom: 20 },
  errorContainer: { backgroundColor: '#FF4444', padding: 14, borderRadius: 10, marginBottom: 15 },
  errorText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center', fontWeight: '600' },
  hintText: { fontSize: 14, color: '#AAAAAA', marginTop: -15, marginBottom: 20, fontStyle: 'italic' },
  mapButton: { backgroundColor: '#DA0037', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  mapButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  mapDescription: { fontSize: 16, color: '#CCCCCC', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 18, color: '#EDEDED', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 2, borderColor: '#555555', borderRadius: 10, padding: 16, marginBottom: 20, backgroundColor: '#1E1E1E', color: '#FFFFFF', fontSize: 17 },
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
      MozAppearance: 'none',
    })
  },
  pickerArrow: { position: 'absolute', right: 18, top: 18, color: '#EDEDED', fontSize: 18, pointerEvents: 'none', fontWeight: 'bold' },
  generateButton: { backgroundColor: '#DA0037', padding: 18, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  generateButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  signupButton: { backgroundColor: '#DA0037', padding: 18, borderRadius: 25, alignItems: 'center' },
  signupButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  disabledInput: { backgroundColor: '#333333', color: '#AAAAAA' },
});
