import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import React from 'react';
import { useUserProfile } from '@/components/UserProfileContext';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ProfileScreen() {
  const { profile } = useUserProfile();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {profile ? (
        <>
          <Text style={styles.info}>Name: {profile.name}</Text>
          <Text style={styles.info}>Location: {profile.location}</Text>
          <Text style={styles.info}>Primary Position: {profile.primaryPosition}</Text>
          <Text style={styles.info}>Secondary Position: {profile.secondaryPosition}</Text>
        </>
      ) : (
        <Text>Your profile information will appear here.</Text>
      )}
      <EditScreenInfo path="/app/(tabs)/profile.tsx" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
  },
});
