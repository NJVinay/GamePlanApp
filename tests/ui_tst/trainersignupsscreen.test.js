const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
const TrainerSignUpScreen = require('../TrainerSignUpScreen');
const { Alert } = require('react-native');
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { setDoc } = require('firebase/firestore');

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('TrainerSignUpScreen Tests', () => {
  const navigation = { navigate: jest.fn() };

  it('validates form before signup', async () => {
    const { getByText } = render(<TrainerSignUpScreen navigation={navigation} />);
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all mandatory fields.');
    });
  });

  it('shows success message on successful signup', async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: '123' } });
    setDoc.mockResolvedValueOnce();

    const { getByPlaceholderText, getByText } = render(<TrainerSignUpScreen navigation={navigation} />);

    fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Jane Smith');
    fireEvent.changeText(getByPlaceholderText('Enter email address'), 'jane@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Trainer account created successfully!');
      expect(navigation.navigate).toHaveBeenCalledWith('Login');
    });
  });
});
