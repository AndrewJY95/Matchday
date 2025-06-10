import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ViewStyle } from 'react-native';
import UserProfileModal from '../UserProfileModal';
import { useUserProfile } from '../UserProfileContext';

// Mock dependencies
jest.mock('../UserProfileContext', () => ({
  useUserProfile: jest.fn(),
}));

describe('UserProfileModal', () => {
  const mockSaveProfile = jest.fn();
  const mockProfile = {
    name: 'John Doe',
    location: 'London',
    primaryPosition: 'ST',
    secondaryPosition: 'CAM'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens automatically when no profile exists', () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      saveProfile: mockSaveProfile
    });

    const { getByText, getByPlaceholderText } = render(<UserProfileModal />);

    // Verify modal is visible with empty fields
    expect(getByText('Welcome! Tell us about you')).toBeTruthy();
    expect(getByPlaceholderText('Name').props.value).toBe('');
    expect(getByPlaceholderText('Location').props.value).toBe('');
  });

  it('populates fields with existing profile data', () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: mockProfile,
      saveProfile: mockSaveProfile
    });

    const { getByPlaceholderText, getByTestId } = render(<UserProfileModal />);

    // Verify fields are populated
    const nameInput = getByPlaceholderText('Name');
    const locationInput = getByPlaceholderText('Location');
    expect(nameInput.props.value).toBe(mockProfile.name);
    expect(locationInput.props.value).toBe(mockProfile.location);

    // Get the buttons by their testIDs
    const primaryST = getByTestId(`primary-position-${mockProfile.primaryPosition}`);
    const secondaryCAM = getByTestId(`secondary-position-${mockProfile.secondaryPosition}`);

    // Verify their styles - handle flattened style arrays in React Native
    const primaryStyles = Array.isArray(primaryST.props.style) ? primaryST.props.style : [primaryST.props.style];
    const secondaryStyles = Array.isArray(secondaryCAM.props.style) ? secondaryCAM.props.style : [secondaryCAM.props.style];

    expect(primaryStyles.some((style: ViewStyle) => style?.backgroundColor === '#4CAF50')).toBe(true);
    expect(secondaryStyles.some((style: ViewStyle) => style?.backgroundColor === '#4CAF50')).toBe(true);
  });

  it('allows selecting positions', () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      saveProfile: mockSaveProfile
    });

    const { getByTestId } = render(<UserProfileModal />);

    // Select positions using testIDs
    const primaryST = getByTestId('primary-position-ST');
    const secondaryCAM = getByTestId('secondary-position-CAM');

    // Select primary and secondary positions
    fireEvent.press(primaryST);
    fireEvent.press(secondaryCAM);

    // Verify their styles - handle flattened style arrays in React Native
    const primaryStyles = Array.isArray(primaryST.props.style) ? primaryST.props.style : [primaryST.props.style];
    const secondaryStyles = Array.isArray(secondaryCAM.props.style) ? secondaryCAM.props.style : [secondaryCAM.props.style];

    expect(primaryStyles.some((style: ViewStyle) => style?.backgroundColor === '#4CAF50')).toBe(true);
    expect(secondaryStyles.some((style: ViewStyle) => style?.backgroundColor === '#4CAF50')).toBe(true);
  });

  it('saves profile data when save button is pressed', async () => {
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      saveProfile: mockSaveProfile
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(<UserProfileModal />);

    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Location'), 'London');

    // Select positions
    fireEvent.press(getByTestId('primary-position-ST'));
    fireEvent.press(getByTestId('secondary-position-CAM'));

    // Mock successful save
    mockSaveProfile.mockResolvedValueOnce(undefined);

    // Press save button
    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    // Verify save was called with correct data
    expect(mockSaveProfile).toHaveBeenCalledWith({
      name: 'John Doe',
      location: 'London',
      primaryPosition: 'ST',
      secondaryPosition: 'CAM'
    });
  });

  it('handles save errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    (useUserProfile as jest.Mock).mockReturnValue({
      profile: null,
      saveProfile: mockSaveProfile
    });

    const { getByText } = render(<UserProfileModal />);

    // Mock failed save
    const error = new Error('Save failed');
    mockSaveProfile.mockRejectedValueOnce(error);

    // Press save button
    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Failed to persist profile', error);
    
    consoleSpy.mockRestore();
  });
});
