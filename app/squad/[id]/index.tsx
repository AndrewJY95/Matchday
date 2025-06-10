import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import FormationPicker from '@/components/FormationPicker';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Fixture {
  id: string;
  opponent: string;
  date: string;
}

export default function SquadScreen() {
  const params = useLocalSearchParams();
  const squadId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [fixtures] = useState<Fixture[]>([
    { id: '1', opponent: 'Rivals FC', date: 'July 20, 2024' },
    { id: '2', opponent: 'United FC', date: 'July 27, 2024' },
  ]);

  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  const toggleAvailability = (fixtureId: string) => {
    setAvailability((prev) => ({ ...prev, [fixtureId]: !prev[fixtureId] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Squad {squadId}</Text>

      <FormationPicker />

      <FlatList
        data={fixtures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.fixtureCard}>
            <Text style={styles.fixtureText}>
              {item.date} vs {item.opponent}
            </Text>
            <TouchableOpacity
              style={styles.availabilityButton}
              onPress={() => toggleAvailability(item.id)}
            >
              <Text style={styles.availabilityButtonText}>
                {availability[item.id] ? 'Available' : 'Set Availability'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.fixtureList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08111c',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  fixtureList: {
    paddingBottom: 20,
  },
  fixtureCard: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  fixtureText: {
    color: '#fff',
    marginBottom: 8,
  },
  availabilityButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  availabilityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
