// ✅ app/_layout.tsx

import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DraxProvider } from 'react-native-drax';
import Header from '@/components/Header';
import UserProfileModal from '@/components/UserProfileModal';
import { UserProfileProvider } from '@/components/UserProfileContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DraxProvider>
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
      </DraxProvider>
    </GestureHandlerRootView>
  );
}
