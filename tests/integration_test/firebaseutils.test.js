// _tests_/firebaseConfig.test.js

import { signInUser, signOutUser, auth, db } from '../utils/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

describe('Firebase Configuration and Authentication', () => {
  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();
  });

  test('should initialize Firebase with correct config', () => {
    expect(getAuth).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
  });

  test('should sign in user successfully', async () => {
    const mockUser = { email: 'user@example.com' };
    signInUser('user@example.com', 'password');
    await expect(signInUser('user@example.com', 'password')).resolves.toEqual(mockUser);
  });

  test('should throw error if sign-in fails', async () => {
    const error = new Error('Invalid credentials');
    signInUser.mockRejectedValueOnce(error);

    await expect(signInUser('user@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
  });

  test('should sign out user successfully', async () => {
    await signOutUser();
    expect(signOut).toHaveBeenCalled();
  });
});
