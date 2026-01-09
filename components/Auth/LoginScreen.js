import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { getResponsiveSize, getBannerHeight, getMaxContentWidth } from '../../utils/responsive';

export default function LoginScreen({ navigation }) {
  const [isTrainer, setIsTrainer] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isWeb, isDesktop } = getResponsiveSize();
  const bannerHeight = getBannerHeight();
  const maxContentWidth = getMaxContentWidth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('⚠️ Missing Information', 'Please fill in all fields before logging in.', [
        { text: 'OK', style: 'default' },
      ]);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const collectionName = isTrainer ? 'trainers' : 'students';
      const userDocRef = doc(db, collectionName, user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (isTrainer) {
          navigation.navigate('TrainerDashboard', {
            trainerID: userData.trainerID,
            trainerData: userData,
          });
        } else {
          navigation.navigate('StudentDashboard', {
            studentID: user.uid,
            studentData: userData,
          });
        }
      } else {
        Alert.alert('Error', `No data found in ${collectionName}. Please sign up.`);
      }
    } catch (error) {
      console.error('Login error:', error.message);
      Alert.alert('Error', `Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { maxWidth: maxContentWidth }
        ]}
        showsVerticalScrollIndicator={true}
        style={{ flex: 1 }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/banner.png')}
            style={[styles.bannerImage, { height: bannerHeight }]}
            resizeMode="contain"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DA0037" />
            <Text style={styles.loadingText}>Logging In...</Text>
          </View>
        ) : (
          <>
            <View style={styles.toggleBox}>
              <TouchableOpacity
                style={[styles.toggleButton, isTrainer ? styles.activeToggle : {}]}
                onPress={() => setIsTrainer(true)}
              >
                <Text style={[styles.toggleText, isTrainer ? styles.activeToggleText : {}]}>
                  Trainer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isTrainer ? styles.activeToggle : {}]}
                onPress={() => setIsTrainer(false)}
              >
                <Text style={[styles.toggleText, !isTrainer ? styles.activeToggleText : {}]}>
                  Student
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#CCCCCC"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.input}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#CCCCCC"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showPassword}>{showPassword ? '🙈' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() =>
                navigation.navigate(isTrainer ? 'TrainerSignUp' : 'StudentSignUp')
              }
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Note about app conversion */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                ℹ️ This app was initially developed as a mobile application (functional for both Android/iOS)
                and has been converted to a web app to showcase full-stack development capabilities and project skills.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    minHeight: '100%',
    paddingBottom: 40,
    alignSelf: 'center',
    width: '100%',
  },
  imageContainer: { width: '100%', alignItems: 'center', marginBottom: 20 },
  bannerImage: {
    width: '100%',
    maxWidth: 600,
  },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  loadingText: { marginTop: 10, color: '#EDEDED', fontSize: 18, fontStyle: 'italic' },
  toggleBox: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#DA0037',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#444444',
    marginBottom: 20,
    width: '100%',
  },
  toggleButton: { flex: 1, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  activeToggle: { backgroundColor: '#DA0037' },
  toggleText: { fontSize: 18, color: '#EDEDED', fontWeight: 'bold' },
  activeToggleText: { color: '#FFFFFF', fontWeight: 'bold' },
  label: { fontSize: 18, color: '#EDEDED', alignSelf: 'flex-start', marginBottom: 10, fontWeight: '600' },
  input: {
    borderWidth: 2,
    borderColor: '#555555',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    fontSize: 17,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: { flex: 1, color: '#FFFFFF', fontSize: 17 },
  showPassword: { fontSize: 17, color: '#CCCCCC', marginLeft: 10 },
  forgotPassword: { color: '#EDEDED', alignSelf: 'flex-end', fontSize: 16, marginBottom: 20 },
  loginButton: { backgroundColor: '#DA0037', paddingVertical: 18, borderRadius: 25, alignItems: 'center', width: '100%', marginBottom: 20 },
  loginButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  separator: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, width: '100%' },
  line: { flex: 1, height: 1, backgroundColor: '#555555' },
  orText: { marginHorizontal: 10, color: '#EDEDED', fontSize: 16 },
  noteContainer: {
    marginTop: 20,
    padding: 18,
    backgroundColor: 'rgba(218, 0, 55, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(218, 0, 55, 0.3)',
    width: '100%',
  },
  noteText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic'
  },
  signUpButton: { borderWidth: 2, borderColor: '#EDEDED', paddingVertical: 18, borderRadius: 25, alignItems: 'center', backgroundColor: '#444444', width: '100%' },
  signUpText: { color: '#EDEDED', fontSize: 20, fontWeight: 'bold' },
});
