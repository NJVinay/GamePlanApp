import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
// ref: https://www.freecodecamp.org/news/how-to-use-settimeout-in-react-using-hooks
export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, check if they're a trainer or student
        try {
          // Check trainers collection first
          const trainerDoc = await getDoc(doc(db, 'trainers', user.uid));
          if (trainerDoc.exists()) {
            console.log('Authenticated trainer found, redirecting to TrainerDashboard');
            navigation.replace('TrainerDashboard');
            return;
          }

          // Check students collection
          const studentDoc = await getDoc(doc(db, 'students', user.uid));
          if (studentDoc.exists()) {
            console.log('Authenticated student found, redirecting to StudentDashboard');
            navigation.replace('StudentDashboard');
            return;
          }

          // User exists but no profile found
          console.warn('User authenticated but no profile found');
          navigation.replace('Login');
        } catch (error) {
          console.error('Error checking user type:', error);
          navigation.replace('Login');
        }
      } else {
        // No user logged in, go to login screen
        console.log('No authenticated user, redirecting to Login');
        setTimeout(() => {
          navigation.replace('Login');
        }, 1500);
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <LinearGradient //ref: https://docs.expo.dev/versions/latest/sdk/linear-gradient
      colors={['#171717', '#444444']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
        />

        {/* Heading */}
        <Text style={styles.heading}>GamePlan</Text>

        {/* Loader */}


        {/* Tagline */}
        <Text style={styles.tagline}>Your sports journey begins here</Text>
        <ActivityIndicator
          size="large"
          color="#EDEDED"
          style={styles.loader}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#DA0037',
    resizeMode: 'cover',
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EDEDED',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#DA0037',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  loader: {
    marginVertical: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#EDEDED',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
