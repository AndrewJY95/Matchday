import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface ProfileData {
  name: string;
  location: string;
  primaryPosition: string;
  secondaryPosition: string;
}

interface UserProfileContextValue {
  profile: ProfileData | null;
  saveProfile: (data: ProfileData) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue>({
  profile: null,
  saveProfile: async () => {},
});

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await SecureStore.getItemAsync('userProfile');
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);
  const saveProfile = async (data: ProfileData) => {
    try {
      console.log('Attempting to save profile:', data);
      await SecureStore.setItemAsync('userProfile', JSON.stringify(data));
      console.log('Profile saved successfully');
      setProfile(data);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Return a user-friendly error message instead of throwing
      return Promise.reject('Failed to save profile. Please try again later.');
    }
  };

  return (
    <UserProfileContext.Provider value={{ profile, saveProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
