const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
const StudentDashboardScreen = require('../StudentDashboardScreen');
const { Alert } = require('react-native');

// Mock external modules
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 0, longitude: 0 } })),
}));

jest.mock('geolib', () => ({
  getDistance: jest.fn(() => 100),
}));

jest.spyOn(Alert, 'alert');

describe('StudentDashboardScreen Tests', () => {
  const navigation = { navigate: jest.fn(), replace: jest.fn() };
  const route = { params: { studentData: { name: 'John Doe', studentID: '12345' } } };
  const trainerLocation = { latitude: 0, longitude: 0, radius: 500 };

  it('renders the component correctly', () => {
    const { getByText } = render(
      <StudentDashboardScreen navigation={navigation} route={route} trainerLocation={trainerLocation} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('ID: 12345')).toBeTruthy();
  });

  it('marks attendance when in target location', async () => {
    const { getByText } = render(
      <StudentDashboardScreen navigation={navigation} route={route} trainerLocation={trainerLocation} />
    );

    const button = getByText('Mark Attendance');
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Attendance marked successfully!');
    });
  });

  it('shows error when marking attendance outside target location', async () => {
    jest.mock('geolib', () => ({
      getDistance: jest.fn(() => 600), // Outside target location
    }));

    const { getByText } = render(
      <StudentDashboardScreen navigation={navigation} route={route} trainerLocation={trainerLocation} />
    );

    const button = getByText('Mark Attendance');
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'You must be in the target location to mark attendance.'
      );
    });
  });

  it('saves progress when all tasks are completed', async () => {
    jest.mock('@react-native-async-storage/async-storage', () => ({
      getItem: jest.fn((key) => {
        if (key === 'tasks') {
          return Promise.resolve(
            JSON.stringify({
              Exercise: [{ id: 1, completed: true }],
              Practice: [{ id: 2, completed: true }],
            })
          );
        }
        return Promise.resolve(null);
      }),
      setItem: jest.fn(() => Promise.resolve()),
    }));

    const { getByText } = render(
      <StudentDashboardScreen navigation={navigation} route={route} trainerLocation={trainerLocation} />
    );

    const button = getByText('Save Progress');
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Progress Saved', 'Progress saved successfully!');
    });
  });

  it('shows error when saving progress with incomplete tasks', async () => {
    jest.mock('@react-native-async-storage/async-storage', () => ({
      getItem: jest.fn((key) => {
        if (key === 'tasks') {
          return Promise.resolve(
            JSON.stringify({
              Exercise: [{ id: 1, completed: false }],
              Practice: [{ id: 2, completed: true }],
            })
          );
        }
        return Promise.resolve(null);
      }),
      setItem: jest.fn(() => Promise.resolve()),
    }));

    const { getByText } = render(
      <StudentDashboardScreen navigation={navigation} route={route} trainerLocation={trainerLocation} />
    );

    const button = getByText('Save Progress');
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Incomplete Tasks',
        'Complete all tasks to save progress.'
      );
    });
  });

  it('resets streak', async () => {
    const { getByText } = render(
      <StudentDashboardScreen navigation={navigation} route={route} trainerLocation={trainerLocation} />
    );

    const button = getByText('Reset Streak');
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Streak Reset', 'Your streak has been reset to 0.');
    });
  });
});
