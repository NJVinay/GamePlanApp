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
