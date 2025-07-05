// __tests__/firebaseConfig.test.js

import * as firebaseConfig from '../utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, getFirestore } from 'firebase/auth';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

describe('Firebase Configuration', () => {
  test('should initialize Firebase with correct config', () => {
    const mockConfig = {
      apiKey: 'YOUR_API_KEY',
      authDomain: 'your-app.firebaseapp.com',
      projectId: 'your-app-id',
      storageBucket: 'your-app.appspot.com',
      messagingSenderId: 'your-messaging-id',
      appId: 'your-app-id',
    };

    firebaseConfig.initializeApp(mockConfig);

    expect(initializeApp).toHaveBeenCalledWith(mockConfig);
  });

  test('should create auth and db instances', () => {
    const { auth, db } = firebaseConfig;

    expect(getAuth).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();

    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });
});
