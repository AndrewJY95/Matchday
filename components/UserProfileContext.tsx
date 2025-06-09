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
    (async () => {
      const stored = await SecureStore.getItemAsync('userProfile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    })();
  }, []);

  const saveProfile = async (data: ProfileData) => {
    await SecureStore.setItemAsync('userProfile', JSON.stringify(data));
    setProfile(data);
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
