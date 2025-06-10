import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import FormationPicker from '@/components/FormationPicker';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SquadScreen() {
  const params = useLocalSearchParams();
  const squadId = Array.isArray(params.id) ? params.id[0] : params.id;  const router = useRouter();

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Squad {squadId}</Text>      <FormationPicker />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#08111c',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },  // Removed unused styles
});
