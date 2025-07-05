import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Import all the screen components
import LoginScreen from '../components/Auth/LoginScreen';
import SettingsScreen from '../components/Auth/SettingsScreen';
import AttendanceScreen from '../components/Auth/AttendanceScreen';
import ForgotPasswordScreen from '../components/Auth/ForgotPasswordScreen';
import LoadingScreen from '../components/Auth/LoadingScreen';
import RegisterScreen from '../components/Auth/RegisterScreen';
import StudentDashboardScreen from '../components/Auth/StudentDashboardScreen';
import StudentProfileScreen from '../components/Auth/StudentProfileScreen';
import StudentSettingsScreen from '../components/Auth/StudentSettingsScreen';
import StudentSignUpScreen from '../components/Auth/StudentSignUpScreen';
import TrainerDashboardScreen from '../components/Auth/TrainerDashboardScreen';
import TrainerProfileScreen from '../components/Auth/TrainerProfileScreen';
import TrainerSignUpScreen from '../components/Auth/TrainerSignUpScreen';

// Mocking any external services if needed
jest.mock('../../services/authService'); // Mock authService for login tests

describe('All Screens Tests', () => {
  // Test LoginScreen
  describe('LoginScreen', () => {
    test('should render login form', () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);
      expect(getByPlaceholderText('Enter email')).toBeTruthy();
      expect(getByPlaceholderText('Enter password')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });

    test('should show error if login fails', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      fireEvent.changeText(getByPlaceholderText('Enter email'), 'user@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter password'), 'wrongpassword');
      fireEvent.press(getByText('Login'));

      await waitFor(() => {
        expect(getByText('Invalid credentials')).toBeTruthy();
      });
    });
  });

  // Test SettingsScreen
  describe('SettingsScreen', () => {
    test('should render settings options', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Dark Theme')).toBeTruthy();
      expect(getByText('Font Size')).toBeTruthy();
      expect(getByText('Save Settings')).toBeTruthy();
    });

    test('should toggle dark theme', () => {
      const { getByTestId } = render(<SettingsScreen />);
      fireEvent.press(getByTestId('dark-theme-toggle'));
      expect(getByTestId('dark-theme-toggle')).toHaveTextContent('Enabled');
    });
  });

  // Test AttendanceScreen
  describe('AttendanceScreen', () => {
    test('should render attendance form', () => {
      const { getByPlaceholderText, getByText } = render(<AttendanceScreen />);
      expect(getByPlaceholderText('Enter student ID')).toBeTruthy();
      expect(getByText('Submit')).toBeTruthy();
    });

    test('should submit form and show success message', () => {
      const { getByPlaceholderText, getByText } = render(<AttendanceScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter student ID'), '12345');
      fireEvent.press(getByText('Submit'));
      expect(getByText('Attendance recorded successfully!')).toBeTruthy();
    });

    test('should show error message for invalid student ID', () => {
      const { getByPlaceholderText, getByText } = render(<AttendanceScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter student ID'), '');
      fireEvent.press(getByText('Submit'));
      expect(getByText('Invalid student ID')).toBeTruthy();
    });
  });

  // Test ForgotPasswordScreen
  describe('ForgotPasswordScreen', () => {
    test('should render forgot password form', () => {
      const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);
      expect(getByPlaceholderText('Enter email')).toBeTruthy();
      expect(getByText('Submit')).toBeTruthy();
    });

    test('should show success message on password reset request', () => {
      const { getByText, getByPlaceholderText } = render(<ForgotPasswordScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter email'), 'user@example.com');
      fireEvent.press(getByText('Submit'));
      expect(getByText('Password reset link sent!')).toBeTruthy();
    });
  });

  // Test LoadingScreen
  describe('LoadingScreen', () => {
    test('should render loading spinner', () => {
      const { getByTestId } = render(<LoadingScreen />);
      expect(getByTestId('loading-spinner')).toBeTruthy();
    });
  });

  // Test RegisterScreen
  describe('RegisterScreen', () => {
    test('should render register form', () => {
      const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
      expect(getByPlaceholderText('Enter name')).toBeTruthy();
      expect(getByPlaceholderText('Enter email')).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
    });

    test('should show error message if registration fails', async () => {
      mockRegister.mockRejectedValueOnce(new Error('Registration failed'));
      const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter email'), 'user@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter name'), 'Test User');
      fireEvent.press(getByText('Register'));

      await waitFor(() => {
        expect(getByText('Registration failed')).toBeTruthy();
      });
    });
  });

  // Additional tests for Student Screens and Trainer Screens can be added here, following the same pattern
  // Test StudentDashboardScreen
  describe('StudentDashboardScreen', () => {
    test('should render student dashboard', () => {
      const { getByText } = render(<StudentDashboardScreen />);
      expect(getByText('Welcome to the Student Dashboard')).toBeTruthy();
    });
  });

  // Test StudentProfileScreen
  describe('StudentProfileScreen', () => {
    test('should render student profile details', () => {
      const { getByText } = render(<StudentProfileScreen />);
      expect(getByText('Name: John Doe')).toBeTruthy();
      expect(getByText('Email: john.doe@example.com')).toBeTruthy();
    });
  });

  // Test TrainerDashboardScreen
  describe('TrainerDashboardScreen', () => {
    test('should render trainer dashboard', () => {
      const { getByText } = render(<TrainerDashboardScreen />);
      expect(getByText('Welcome to the Trainer Dashboard')).toBeTruthy();
    });
  });

  // Test TrainerProfileScreen
  describe('TrainerProfileScreen', () => {
    test('should render trainer profile details', () => {
      const { getByText } = render(<TrainerProfileScreen />);
      expect(getByText('Trainer: Jane Smith')).toBeTruthy();
    });
  });

  // Test TrainerSignUpScreen
  describe('TrainerSignUpScreen', () => {
    test('should render trainer signup form', () => {
      const { getByPlaceholderText, getByText } = render(<TrainerSignUpScreen />);
      expect(getByPlaceholderText('Enter name')).toBeTruthy();
      expect(getByPlaceholderText('Enter email')).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
    });
  });
});
