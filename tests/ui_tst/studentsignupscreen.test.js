const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
const StudentSignUpScreen = require('../StudentSignUpScreen');
const { Alert } = require('react-native');
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { setDoc, getDoc, doc } = require('firebase/firestore');

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('StudentSignUpScreen Tests', () => {
  const navigation = { navigate: jest.fn() };

  it('validates form before signup', async () => {
    const { getByText } = render(<StudentSignUpScreen navigation={navigation} />);
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all mandatory fields.');
    });
  });

  it('shows success message on successful signup', async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '123' } });
    setDoc.mockResolvedValueOnce();

    const { getByPlaceholderText, getByText } = render(<StudentSignUpScreen navigation={navigation} />);

    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Re-enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Enter your trainer ID'), 'T12345');

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Student account created successfully!');
      expect(navigation.navigate).toHaveBeenCalledWith('Login');
    });
  });
});
describe('Basic Math Test', () => {
    it('should correctly add 1 + 1', () => {
      const result = 1 + 1;
      expect(result).toBe(2);
    });
  });
  