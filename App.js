import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, Text, StyleSheet, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { StudentProvider } from './components/Auth/StudentContext';
import { TrainerProvider } from './components/Auth/TrainerContext';
import RegisterScreen from './components/Auth/RegisterScreen';
import ForgotPasswordScreen from './components/Auth/ForgotPasswordScreen';
import TrainerSignUpScreen from './components/Auth/TrainerSignUpScreen';
import StudentSignUpScreen from './components/Auth/StudentSignUpScreen';
import TrainerDashboardScreen from './components/Auth/TrainerDashboardScreen';
import StudentDashboardScreen from './components/Auth/StudentDashboardScreen';
import LoginScreen from './components/Auth/LoginScreen';
import LoadingScreen from './components/Auth/LoadingScreen';
import TrainerProfileScreen from './components/Auth/TrainerProfileScreen';
import SettingsScreen from './components/Auth/SettingsScreen';
import StudentProfileScreen from './components/Auth/StudentProfileScreen';
import StudentSettingsScreen from './components/Auth/StudentSettingsScreen';
import StudentPage from './components/Auth/StudentPage';
import AttendanceScreen from './components/Auth/AttendanceScreen';

// Inject custom web styles
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    
    body {
      overflow-y: auto !important;
    }
    
    #root {
      width: 100%;
      min-height: 100vh;
    }
    
    /* Dropdown styling */
    select {
      background-color: #1E1E1E !important;
      color: #FFFFFF !important;
      border: 2px solid #555555 !important;
      padding: 16px !important;
      border-radius: 8px !important;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }
    
    select option {
      background-color: #1E1E1E !important;
      color: #FFFFFF !important;
      padding: 10px !important;
    }
    
    select option:hover,
    select option:focus {
      background-color: #DA0037 !important;
    }
    
    select:focus {
      background-color: #1E1E1E !important;
      outline: none;
      border-color: #DA0037 !important;
    }
    
    /* Button hover effects */
    button, 
    [role="button"],
    input[type="submit"],
    input[type="button"] {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    
    button:hover,
    [role="button"]:hover,
    input[type="submit"]:hover,
    input[type="button"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(218, 0, 55, 0.3);
    }
    
    button:active,
    [role="button"]:active {
      transform: translateY(0);
      box-shadow: 0 4px 8px rgba(218, 0, 55, 0.2);
    }
    
    /* Input focus effects */
    input:not([type="checkbox"]):not([type="radio"]),
    textarea {
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    input:not([type="checkbox"]):not([type="radio"]):focus,
    textarea:focus {
      border-color: #DA0037 !important;
      box-shadow: 0 0 0 3px rgba(218, 0, 55, 0.1);
    }
    
    /* Text selection */
    ::selection {
      background-color: #DA0037;
      color: #FFFFFF;
    }
    
    /* Accessibility */
    *:focus-visible {
      outline: 2px solid #DA0037;
      outline-offset: 2px;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 16px;
    }
    
    ::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #DA0037;
      border-radius: 8px;
      border: 3px solid #1a1a1a;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #ff0044;
    }
  `;
  document.head.appendChild(style);
}

const Stack = createStackNavigator();

const HeaderLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('./assets/logo.png')}
      style={styles.logo}
      resizeMode="cover"
    />
    <Text style={styles.logoText}>
      <Text style={{ color: '#DA0037' }}>GAME</Text>
      <Text style={{ color: '#EDEDED' }}>PLAN</Text>
    </Text>
  </View>
);

export default function App() {
  const [trainerLocation, setTrainerLocation] = useState({
    latitude: "56.1971946",
    longitude: "15.6188414",
    radius: "10000",
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setTrainerLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          radius: '1000',
        });
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  return (
    <View style={{ flex: 1, height: Platform.OS === 'web' ? '100vh' : '100%' }}>
      <StudentProvider>
        <TrainerProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Loading"
              screenOptions={{
                headerStyle: { backgroundColor: '#171717' },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
                headerTitle: () => <HeaderLogo />,
              }}
            >
              <Stack.Screen
                name="Loading"
                component={LoadingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen
                name="TrainerSignUp"
                options={{ headerShown: true }}
              >
                {(props) => (
                  <TrainerSignUpScreen
                    {...props}
                    saveTrainerLocation={setTrainerLocation}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="StudentSignUp" component={StudentSignUpScreen} />
              <Stack.Screen
                name="TrainerDashboard"
                component={TrainerDashboardScreen}
                options={{
                  title: 'Trainer Dashboard',
                  headerStyle: { backgroundColor: '#171717' },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen
                name="StudentDashboard"
                options={{
                  title: 'Student Dashboard',
                  headerStyle: { backgroundColor: '#171717' },
                  headerTintColor: '#fff',
                }}
              >
                {(props) => (
                  <StudentDashboardScreen
                    {...props}
                    trainerLocation={trainerLocation}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="StudentProfile"
                component={StudentProfileScreen}
                options={{
                  title: 'Student Profile',
                  headerStyle: { backgroundColor: '#171717' },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen
                name="TrainerProfile"
                component={TrainerProfileScreen}
                options={{
                  title: 'Trainer Profile',
                  headerStyle: { backgroundColor: '#171717' },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                  title: 'Settings',
                  headerStyle: { backgroundColor: '#171717' },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen
                name="StudentSettings"
                component={StudentSettingsScreen}
                options={{
                  title: 'Student Settings',
                  headerStyle: { backgroundColor: '#171717' },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen name="StudentPage" component={StudentPage} />
              <Stack.Screen
                name="AttendanceScreen"
                component={AttendanceScreen}
                options={{
                  title: 'Attendance',
                  headerStyle: { backgroundColor: '#171717' },
                  headerTintColor: '#fff',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </TrainerProvider>
      </StudentProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DA0037',
  },
  logoText: {
    fontSize: 29,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
