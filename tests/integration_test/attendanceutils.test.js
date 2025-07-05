// _tests_/attendanceUtils.test.js

import { hasAttendedEnoughClasses, isEligibleForCertification } from '../utils/attendanceUtils';

describe('Attendance Utilities', () => {
  test('should return true if student attended 75% or more classes', () => {
    expect(hasAttendedEnoughClasses(10, 8)).toBe(true);  // 8 out of 10 is 80%
  });

  test('should return false if student attended less than 75% classes', () => {
    expect(hasAttendedEnoughClasses(10, 5)).toBe(false);  // 5 out of 10 is 50%
  });

  test('should return true if student attended 80% or more classes for certification', () => {
    expect(isEligibleForCertification(10, 8)).toBe(true);  // 8 out of 10 is 80%
  });

  test('should return false if student attended less than 80% classes for certification', () => {
    expect(isEligibleForCertification(10, 7)).toBe(false);  // 7 out of 10 is 70%
  });
});
