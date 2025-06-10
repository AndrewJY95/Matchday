import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SquadScreen from '../index';

// Mock the expo-router hooks
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '123' }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SquadScreen', () => {
  it('renders correctly with fixtures', () => {
    const { getByText } = render(<SquadScreen />);
    
    // Check if the squad title is rendered
    expect(getByText('Squad 123')).toBeTruthy();
    
    // Check if fixtures are rendered
    expect(getByText(/Rivals FC/)).toBeTruthy();
    expect(getByText(/United FC/)).toBeTruthy();
  });

  it('toggles availability when button is pressed', () => {
    const { getAllByText } = render(<SquadScreen />);
    
    // Get the first "Set Availability" button
    const availabilityButton = getAllByText('Set Availability')[0];
    
    // Initial state should be "Set Availability"
    expect(availabilityButton).toBeTruthy();
    
    // Click the button
    fireEvent.press(availabilityButton);
    
    // After clicking, text should change to "Available"
    expect(getAllByText('Available')[0]).toBeTruthy();
  });
});
