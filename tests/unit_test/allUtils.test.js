// __tests__/utils.test.js

// Import the utility functions
import { hasAttendedEnoughClasses } from '../utils/attendanceUtils';
import * as firebaseConfig from '../utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, getFirestore } from 'firebase/auth';

// Mock Firebase methods
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

describe('Utility Functions and Firebase Config Tests', () => {

  // Tests for attendanceUtils.js
  describe('Attendance Utilities', () => {
    test('should return true if attended classes are 75% or more of total classes', () => {
      expect(hasAttendedEnoughClasses(10, 8)).toBe(true);  // 80% attendance
    });

    test('should return false if attended classes are less than 75% of total classes', () => {
      expect(hasAttendedEnoughClasses(10, 5)).toBe(false);  // 50% attendance
    });

    test('should return true for exactly 75% attendance', () => {
      expect(hasAttendedEnoughClasses(10, 7.5)).toBe(true);  // Exactly 75% attendance
    });

    test('should return false for 0% attendance', () => {
      expect(hasAttendedEnoughClasses(10, 0)).toBe(false);  // 0% attendance
    });
  });

  // Tests for firebaseConfig.js
  describe('Firebase Configuration', () => {
    test('should initialize Firebase with correct config', () => {
      const mockConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-app.firebaseapp.com",
        projectId: "your-app-id",
        storageBucket: "your-app.appspot.com",
        messagingSenderId: "your-messaging-id",
        appId: "your-app-id"
      };

      // Initialize Firebase
      firebaseConfig.initializeApp(mockConfig);

      // Ensure the Firebase app is initialized with the correct config
      expect(initializeApp).toHaveBeenCalledWith(mockConfig);
    });

    test('should create auth and db instances', () => {
      const { auth, db } = firebaseConfig;

      // Check if Firebase services are initialized
      expect(getAuth).toHaveBeenCalled();
      expect(getFirestore).toHaveBeenCalled();

      // Verify auth and db objects are defined
      expect(auth).toBeDefined();
      expect(db).toBeDefined();
    });
  });

});

