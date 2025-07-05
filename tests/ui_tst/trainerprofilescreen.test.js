React = require('react');
const { render, waitFor } = require('@testing-library/react-native');
const TrainerProfileScreen = require('../TrainerProfileScreen');
const { Alert } = require('react-native');
const { getDoc, doc } = require('firebase/firestore');

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('TrainerProfileScreen Tests', () => {
  const navigation = { goBack: jest.fn(), navigate: jest.fn() };
  const route = { params: { trainerData: { trainerID: 'T123', name: 'Jane Smith' } } };

  it('renders the trainer profile correctly', () => {
    const { getByText } = render(
      <TrainerProfileScreen route={route} navigation={navigation} />
    );

    expect(getByText('Jane Smith')).toBeTruthy();
    expect(getByText('ID: T123')).toBeTruthy();
  });

  it('shows an error if trainer data is missing', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    render(
      <TrainerProfileScreen
        route={{ params: { trainerData: null } }}
        navigation={navigation}
      />
    );

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Trainer profile not found.');
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });
});
