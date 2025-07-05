// __tests__/context.test.js

import React from 'react';
import { render, act } from '@testing-library/react-native';
import { StudentProvider, useStudent } from '../utils/StudentContext';
import { TrainerProvider, useTrainer } from '../utils/TrainerContext';

// Test for StudentContext
describe('StudentContext', () => {
  test('should provide student data and update it', () => {
    const TestComponent = () => {
      const { studentData, updateStudentData } = useStudent();

      return (
        <>
          <button onClick={() => updateStudentData({ name: 'John Doe' })}>
            Update
          </button>
          {studentData && <p>{studentData.name}</p>}
        </>
      );
    };

    const { getByText } = render(
      <StudentProvider>
        <TestComponent />
      </StudentProvider>
    );

    act(() => {
      getByText('Update').props.onClick();
    });

    expect(getByText('John Doe')).toBeTruthy();
  });
});

// Test for TrainerContext
describe('TrainerContext', () => {
  test('should provide trainer data and update it', () => {
    const TestComponent = () => {
      const { trainerData, updateTrainerData } = useTrainer();

      return (
        <>
          <button onClick={() => updateTrainerData({ name: 'Jane Smith' })}>
            Update
          </button>
          {trainerData && <p>{trainerData.name}</p>}
        </>
      );
    };

    const { getByText } = render(
      <TrainerProvider>
        <TestComponent />
      </TrainerProvider>
    );

    act(() => {
      getByText('Update').props.onClick();
    });

    expect(getByText('Jane Smith')).toBeTruthy();
  });
});
