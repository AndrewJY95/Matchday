import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import type { WrapperComponent } from '@testing-library/react-hooks';
import { UserProfileProvider, useUserProfile } from '../UserProfileContext';
import type { ProfileData } from '../UserProfileContext';
import * as SecureStore from 'expo-secure-store';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn()
}));

describe('UserProfileContext', () => {
  const mockProfile: ProfileData = {
    name: 'John Doe',
    location: 'London',
    primaryPosition: 'Forward',
    secondaryPosition: 'Midfielder'
  };

  const wrapper: WrapperComponent<any> = ({ children }) => (
    <UserProfileProvider>{children}</UserProfileProvider>
  );

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock SecureStore.isAvailableAsync to return true by default
    (SecureStore.isAvailableAsync as jest.Mock).mockResolvedValue(true);
  });
  it('loads profile from secure storage on mount', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(mockProfile));

    const { result } = renderHook(() => useUserProfile(), { wrapper });

    // Initial state should be null
    expect(result.current.profile).toBeNull();

    // Wait for the next update using act instead of waitForNextUpdate
    await act(async () => {
      // Let all promises resolve
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Profile should be loaded from storage
    expect(result.current.profile).toEqual(mockProfile);
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('userProfile');
  });

  it('saves profile to secure storage', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUserProfile(), { wrapper });

    await act(async () => {
      await result.current.saveProfile(mockProfile);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'userProfile',
      JSON.stringify(mockProfile)
    );
  });

  it('handles SecureStore unavailability', async () => {
    (SecureStore.isAvailableAsync as jest.Mock).mockResolvedValue(false);
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { result } = renderHook(() => useUserProfile(), { wrapper });

    await act(async () => {
      await result.current.saveProfile(mockProfile);
    });

    expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    expect(result.current.profile).toEqual(mockProfile);
    
    consoleSpy.mockRestore();
  });

  it('handles storage errors gracefully', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { result } = renderHook(() => useUserProfile(), { wrapper });

    // Initial state should be null
    expect(result.current.profile).toBeNull();
    
    // Wait for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Profile should still be null after error
    expect(result.current.profile).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load profile', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});
