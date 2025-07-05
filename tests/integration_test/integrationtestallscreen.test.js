import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import LoginScreen from '../components/Auth/LoginScreen';
import SettingsScreen from '../components/Auth/SettingsScreen';
import AttendanceScreen from '../components/Auth/AttendanceScreen';
import StudentDashboardScreen from '../components/Auth/StudentDashboardScreen';
import { StudentContextProvider } from '../components/Auth/StudentContext';
import { TrainerContextProvider } from '../components/Auth/TrainerContext';

jest.mock('../../services/authService'); // Mock authService for login tests

describe('All Screens Integration Tests', () => {

  // Test App.js (Ensure it renders correctly)
  describe('App', () => {
    test('should render login screen initially', () => {
      const { getByPlaceholderText, getByText } = render(<App />);
      expect(getByPlaceholderText('Enter email')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });

    test('should navigate to StudentDashboardScreen after login', async () => {
      const { getByPlaceholderText, getByText } = render(<App />);

      fireEvent.changeText(getByPlaceholderText('Enter email'), 'user@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter password'), 'password');
      fireEvent.press(getByText('Login'));

      await waitFor(() => {
        expect(getByText('Welcome to the Student Dashboard')).toBeTruthy();
      });
    });
  });

  // Test LoginScreen (Ensure login functionality works)
  describe('LoginScreen', () => {
    test('should display login form', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('Login')).toBeTruthy();
    });

    test('should show error if login fails', async () => {
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter email'), 'user@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter password'), 'wrongpassword');
      fireEvent.press(getByText('Login'));

      await waitFor(() => {
        expect(getByText('Invalid credentials')).toBeTruthy();
      });
    });
  });

  // Test SettingsScreen (Ensure settings functionality works)
  describe('SettingsScreen', () => {
    test('should render settings options', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Dark Theme')).toBeTruthy();
      expect(getByText('Font Size')).toBeTruthy();
    });

    test('should toggle dark theme', () => {
      const { getByTestId } = render(<SettingsScreen />);
      fireEvent.press(getByTestId('dark-theme-toggle'));
      expect(getByTestId('dark-theme-toggle')).toHaveTextContent('Enabled');
    });
  });

  // Test AttendanceScreen (Ensure attendance functionality works)
  describe('AttendanceScreen', () => {
    test('should render attendance form', () => {
      const { getByText } = render(<AttendanceScreen />);
      expect(getByText('Enter student ID')).toBeTruthy();
    });

    test('should submit form and show success message', () => {
      const { getByText } = render(<AttendanceScreen />);
      fireEvent.changeText(getByText('Enter student ID'), '12345');
      fireEvent.press(getByText('Submit'));
      expect(getByText('Attendance recorded successfully!')).toBeTruthy();
    });
  });

  // Test StudentDashboardScreen (Ensure dashboard functionality works)
  describe('StudentDashboardScreen', () => {
    test('should render student dashboard', () => {
      const { getByText } = render(
        <StudentContextProvider>
          <StudentDashboardScreen />
        </StudentContextProvider>
      );
      expect(getByText('Welcome to the Student Dashboard')).toBeTruthy();
    });
  });

  // Test TrainerProfileScreen (Ensure trainer profile functionality works)
  describe('TrainerProfileScreen', () => {
    test('should render trainer profile details', () => {
      const { getByText } = render(<TrainerProfileScreen />);
      expect(getByText('Trainer: Jane Smith')).toBeTruthy();
    });
  });
});
