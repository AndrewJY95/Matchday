// app/_layout.tsx

import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import UserProfileModal from '@/components/UserProfileModal';
import { UserProfileProvider } from '@/components/UserProfileContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
