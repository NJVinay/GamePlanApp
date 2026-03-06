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
import { theme } from '../../utils/theme';

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
    <LinearGradient colors={[theme.colors.background, theme.colors.surfaceLight]} style={styles.gradient}>
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
            <ActivityIndicator size="large" color={theme.colors.primary} />
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
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: '100%',
    paddingBottom: theme.spacing.xxl,
    alignSelf: 'center',
    width: '100%',
  },
  imageContainer: { width: '100%', alignItems: 'center', marginBottom: theme.spacing.lg },
  bannerImage: {
    width: '100%',
    maxWidth: 600,
  },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  loadingText: { marginTop: theme.spacing.sm, color: theme.colors.secondary, fontSize: theme.typography.size.md, fontStyle: 'italic' },
  toggleBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceLight,
    marginBottom: theme.spacing.lg,
    width: '100%',
    ...theme.shadows.sm,
  },
  toggleButton: { flex: 1, paddingVertical: theme.spacing.md, alignItems: 'center', justifyContent: 'center' },
  activeToggle: { backgroundColor: theme.colors.primary },
  toggleText: { fontSize: theme.typography.size.md, color: theme.colors.textSecondary, fontWeight: theme.typography.weight.semiBold },
  activeToggleText: { color: theme.colors.text, fontWeight: theme.typography.weight.bold },
  label: { fontSize: theme.typography.size.md, color: theme.colors.secondary, alignSelf: 'flex-start', marginBottom: theme.spacing.sm, fontWeight: theme.typography.weight.semiBold },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.size.md,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  passwordInput: { flex: 1, color: theme.colors.text, fontSize: theme.typography.size.md },
  showPassword: { fontSize: theme.typography.size.md, color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
  forgotPassword: { color: theme.colors.secondary, alignSelf: 'flex-end', fontSize: theme.typography.size.md, marginBottom: theme.spacing.lg },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  loginButtonText: { color: theme.colors.text, fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.bold },
  separator: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg, width: '100%' },
  line: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  orText: { marginHorizontal: theme.spacing.sm, color: theme.colors.textSecondary, fontSize: theme.typography.size.md },
  noteContainer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
    width: '100%',
  },
  noteText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.sm,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic'
  },
  signUpButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    width: '100%',
    ...theme.shadows.sm,
  },
  signUpText: { color: theme.colors.secondary, fontSize: theme.typography.size.lg, fontWeight: theme.typography.weight.bold },
});
