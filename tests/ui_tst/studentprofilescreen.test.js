const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');
const StudentProfileScreen = require('../StudentProfileScreen');
const { Alert } = require('react-native');
const { getDoc, doc } = require('firebase/firestore');

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('StudentProfileScreen Tests', () => {
  const navigation = { navigate: jest.fn() };
  const route = { params: { student: { studentID: 'S123', name: 'John Doe', email: 'john@example.com' } } };

  it('renders the student profile correctly', () => {
    const { getByText } = render(
      <StudentProfileScreen route={route} navigation={navigation} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('ID: S123')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('shows an error if student data is missing', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    render(
      <StudentProfileScreen
        route={{ params: { student: null } }}
        navigation={navigation}
      />
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Student profile not found.');
      expect(navigation.navigate).toHaveBeenCalledWith('StudentDashboard');
    });
  });
});
