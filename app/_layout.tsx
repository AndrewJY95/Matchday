// app/_layout.tsx

import 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '@/components/Header';
import UserProfileModal from '@/components/UserProfileModal';
import { UserProfileProvider } from '@/components/UserProfileContext';


export default function RootLayout() {
  const app = (
    <SafeAreaProvider>
      <UserProfileProvider>
          <StatusBar style="light" backgroundColor="#1a1a2e" />
          <UserProfileModal />
          <Stack
            screenOptions={{
              header: () => <Header />,
              contentStyle: {
                backgroundColor: '#0f0f23',
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
          </Stack>
      </UserProfileProvider>
    </SafeAreaProvider>
  );

  return Platform.OS === 'web' ? app : (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {app}
    </GestureHandlerRootView>
  );
}
