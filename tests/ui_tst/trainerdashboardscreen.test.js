const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
const TrainerDashboardScreen = require('../TrainerDashboardScreen');
const { Alert } = require('react-native');
const { collection, query, where, getDocs } = require('firebase/firestore');

// Mock Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('TrainerDashboardScreen Tests', () => {
  const navigation = { navigate: jest.fn(), replace: jest.fn() };
  const route = { params: { trainerData: { trainerID: 'T12345', name: 'John Doe' } } };

  it('renders the component correctly', () => {
    const { getByText } = render(
      <TrainerDashboardScreen navigation={navigation} route={route} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('ID: T12345')).toBeTruthy();
    expect(getByText('Students List')).toBeTruthy();
  });

  it('shows an error if trainerID is missing', () => {
    render(
      <TrainerDashboardScreen
        navigation={navigation}
        route={{ params: { trainerData: {} } }}
      />
    );

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Trainer ID is missing. Please log in again.');
    expect(navigation.replace).toHaveBeenCalledWith('Login');
  });

  it('fetches and displays students', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ name: 'Student A', studentID: 'S123', streak: 5 }) },
        { id: '2', data: () => ({ name: 'Student B', studentID: 'S124', streak: 3 }) },
      ],
    });

    const { getByText } = render(
      <TrainerDashboardScreen navigation={navigation} route={route} />
    );

    await waitFor(() => {
      expect(getByText('Student A')).toBeTruthy();
      expect(getByText('ID: S123')).toBeTruthy();
      expect(getByText('🔥 Streak: 5 days')).toBeTruthy();
      expect(getByText('Student B')).toBeTruthy();
      expect(getByText('ID: S124')).toBeTruthy();
      expect(getByText('🔥 Streak: 3 days')).toBeTruthy();
    });
  });

  it('displays an error message if no students are found', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    const { getByText } = render(
      <TrainerDashboardScreen navigation={navigation} route={route} />
    );

    await waitFor(() => {
      expect(getByText('No students found. Ask students to join using your Trainer ID.')).toBeTruthy();
    });
  });

  it('filters students based on search query', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ name: 'Student A', studentID: 'S123', streak: 5 }) },
        { id: '2', data: () => ({ name: 'Student B', studentID: 'S124', streak: 3 }) },
      ],
    });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <TrainerDashboardScreen navigation={navigation} route={route} />
    );

    await waitFor(() => {
      expect(getByText('Student A')).toBeTruthy();
      expect(getByText('Student B')).toBeTruthy();
    });

    const searchInput = getByPlaceholderText('Search by name or ID...');
    fireEvent.changeText(searchInput, 'Student A');

    expect(getByText('Student A')).toBeTruthy();
    expect(queryByText('Student B')).toBeNull();
  });

  it('navigates to the StudentPage when a student card is pressed', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ name: 'Student A', studentID: 'S123', streak: 5 }) },
      ],
    });

    const { getByText } = render(
      <TrainerDashboardScreen navigation={navigation} route={route} />
    );

    const studentCard = await waitFor(() => getByText('Student A'));
    fireEvent.press(studentCard);

    expect(navigation.navigate).toHaveBeenCalledWith('StudentPage', {
      student: {
        id: '1',
        name: 'Student A',
        studentID: 'S123',
        streak: 5,
      },
    });
  });
});
