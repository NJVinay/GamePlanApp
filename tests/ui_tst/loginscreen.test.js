const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
const LoginScreen = require('./LoginScreen');


jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: { uid: 'testUser123' } })
  ),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ trainerID: 'T123' }) })),
}));

jest.mock('../../utils/firebaseConfig', () => ({
  auth: {},
  db: {},
}));

describe('LoginScreen', () => {
  const mockNavigate = jest.fn();

  const renderComponent = () => {
    return render(<LoginScreen navigation={{ navigate: mockNavigate }} />);
  };

  it('renders all UI components correctly', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
  });

  it('shows an error alert if fields are empty', async () => {
    const { getByText } = renderComponent();

    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '⚠️ Missing Information',
        'Please fill in all fields before logging in.',
        [{ text: 'OK', style: 'default' }]
      );
    });
  });

  it('logs in successfully and navigates to TrainerDashboard', async () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('TrainerDashboard', {
        trainerID: 'T123',
        trainerData: { trainerID: 'T123' },
      });
    });
  });

  it('toggles user type between Trainer and Student', () => {
    const { getByText } = renderComponent();

    fireEvent.press(getByText('Student'));
    expect(getByText('Student').props.style).toContainEqual({ color: '#FFFFFF' });

    fireEvent.press(getByText('Trainer'));
    expect(getByText('Trainer').props.style).toContainEqual({ color: '#FFFFFF' });
  });

  it('shows and hides the password correctly', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    const passwordInput = getByPlaceholderText('Enter your password');
    const showPasswordButton = getByText('👁️‍🗨️');

    fireEvent.press(showPasswordButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(showPasswordButton);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });
});
