import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig'; 
// ref: https://www.bacancytechnology.com/blog/react-native-firebase-auth
// ref: https://amanhimself.dev/blog/implement-forgot-password-firebase-react-native
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    try {
      
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Success',
        'A password reset link has been sent to your email. Please check your inbox to reset your password.'
      );
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert(
        'Error',
        'Failed to send password reset email. Please check the email address and try again.'
      );
    }
  };
// ref:https://docs.expo.dev/versions/latest/sdk/linear-gradient    
  return (
    <LinearGradient
      colors={['#171717', '#444444']} 
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.subheading}>
            Enter your email, and we’ll send you instructions to reset your password.
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Stay Active, Stay Ahead!</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EDEDED',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  subheading: {
    fontSize: 14,
    color: '#EDEDED',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#EDEDED',
    marginBottom: 5,
    fontWeight: '600',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 10,
    padding: 6,
    backgroundColor: '#444444',
  },
  input: {
    fontSize: 16,
    color: '#EDEDED',
    paddingHorizontal: 10,
  },
  resetButton: {
    backgroundColor: '#DA0037',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#DA0037',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  resetButtonText: {
    color: '#EDEDED',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#EDEDED',
    fontStyle: 'italic',
  },
});
