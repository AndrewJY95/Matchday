import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import UserProfileModal from '@/components/UserProfileModal';

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}