const React = require('react');
const { render, fireEvent, waitFor } = require('@testing-library/react-native');
const ForgotPasswordScreen = require('./ForgotPasswordScreen');
const { sendPasswordResetEmail } = require('firebase/auth');


jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
}));

describe('ForgotPasswordScreen', () => {
  it('renders all UI components correctly', () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);

    expect(getByText('Forgot Password')).toBeTruthy();
    expect(getByText('Enter your email, and we’ll send you instructions to reset your password.')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByText('Reset Password')).toBeTruthy();
    expect(getByText('Stay Active, Stay Ahead!')).toBeTruthy();
  });

  it('shows an alert if the email field is empty when "Reset Password" is pressed', async () => {
    const { getByText } = render(<ForgotPasswordScreen />);

    jest.spyOn(global, 'alert').mockImplementation(() => {});

    fireEvent.press(getByText('Reset Password'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Error', 'Please enter your email.');
    });
  });

  it('calls sendPasswordResetEmail with the entered email', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const resetButton = getByText('Reset Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
    });
  });

  it('shows a success alert if the email is sent successfully', async () => {
    sendPasswordResetEmail.mockResolvedValueOnce();
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const resetButton = getByText('Reset Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(resetButton);

    jest.spyOn(global, 'alert').mockImplementation(() => {});

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Success',
        'A password reset link has been sent to your email. Please check your inbox to reset your password.'
      );
    });
  });

  it('shows an error alert if sending the email fails', async () => {
    sendPasswordResetEmail.mockRejectedValueOnce(new Error('Network Error'));
    const { getByPlaceholderText, getByText } = render(<ForgotPasswordScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const resetButton = getByText('Reset Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(resetButton);

    jest.spyOn(global, 'alert').mockImplementation(() => {});

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Error',
        'Failed to send password reset email. Please check the email address and try again.'
      );
    });
  });
});
