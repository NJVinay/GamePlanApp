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
import { doc, setDoc, getDoc } from 'firebase/firestore';
//ref: https://dev.to/zolomohan/react-native-firebase-email-password-authentication-3889
export default function StudentSignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    trainerID: '',
    address: '',
    sport: '',
    gender: '',
    emergencyContact: '',
    studentID: '',
  });
  const [loading, setLoading] = useState(false);

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
    } = formData;

    if (
      !fullName ||
      !age ||
      !sport ||
      !gender ||
      !email ||
      !password ||
      !confirmPassword ||
      !trainerID ||
      !studentID
    ) {
      Alert.alert('Error', 'Please fill in all mandatory fields.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      
      const trainerDocRef = doc(db, 'trainers', formData.trainerID);
      const trainerDoc = await getDoc(trainerDocRef);

      if (!trainerDoc.exists()) {
        Alert.alert('Success', "Student account created successfully");
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
        address: formData.address,
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
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already in use. Please use a different email.');
      } else if (error.code === 'permission-denied') {
        Alert.alert('Error', 'You do not have permission to perform this operation.');
      } else {
        Alert.alert('Error', `Failed to save data: ${error.message}`);
      }
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
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Prefer not to say" value="Prefer not to say" />
          </Picker>
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

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          placeholderTextColor="#CCCCCC"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />

        {/* Sport */}
        <Text style={styles.label}>Sport</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.sport}
            onValueChange={(value) => handleInputChange('sport', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Sport" value="" />
            {['Badminton', 'Basketball', 'Cricket', 'Cycling', 'Football', 'Swimming'].map(
              (sportOption) => (
                <Picker.Item key={sportOption} label={sportOption} value={sportOption} />
              )
            )}
          </Picker>
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
  heading: { fontSize: 28, fontWeight: 'bold', color: '#EDEDED', textAlign: 'center', marginBottom: 10 },
  subheading: { fontSize: 16, textAlign: 'center', color: '#CCCCCC', marginBottom: 20 },
  label: { fontSize: 16, color: '#EDEDED', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
  },
  studentIDContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  generateButton: { backgroundColor: '#DA0037', padding: 10, borderRadius: 10, marginLeft: 10 },
  generateButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  pickerContainer: { borderWidth: 1, borderColor: '#555555', borderRadius: 10, backgroundColor: '#1E1E1E', marginBottom: 20 },
  picker: { color: '#FFFFFF' },
  signupButton: { backgroundColor: '#DA0037', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
  signupButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { borderWidth: 1, borderColor: '#CCCCCC', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  cancelButtonText: { color: '#CCCCCC', fontSize: 16, fontWeight: 'bold' },
  loginRedirect: { textAlign: 'center', color: '#DA0037', fontSize: 14, marginTop: 10, textDecorationLine: 'underline' },
});
