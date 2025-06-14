// app/squad/[id]/index.tsx
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormationPicker from '@/components/FormationPicker';
import type { Player } from '@/components/FormationPicker/types';

const allPlayers: Player[] = [
  { id: '1', name: 'Marcus' },
  { id: '2', name: 'James' },
  { id: '3', name: 'Alex' },
  { id: '4', name: 'Chris' },
  { id: '5', name: 'Jordan' },
  { id: '6', name: 'Sam' },
  { id: '7', name: 'Michael' },
  { id: '8', name: 'Daniel' },
  { id: '9', name: 'Luke' },
  { id: '10', name: 'Oliver' },
  { id: '11', name: 'Jack' },
];

export default function SquadScreen() {
  const params = useLocalSearchParams();
  const squadId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [playerCount, setPlayerCount] = useState(11);
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedPlayers = allPlayers.slice(0, playerCount);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.selectionRow}>
          <View style={styles.dropdownContainer}>
            <Pressable
              onPress={() => setShowDropdown(!showDropdown)}
              style={styles.dropdownToggle}
            >
              <Text style={styles.toggleText}>{playerCount} Players ▾</Text>
            </Pressable>
            {showDropdown && (
              <View style={styles.dropdownMenu}>
                {[5, 6, 7, 8, 9, 10, 11].map((n) => (
                  <Pressable
                    key={n}
                    onPress={() => {
                      setPlayerCount(n);
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownOption}
                  >
                    <Text style={styles.toggleText}>{n} Players</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>

        <FormationPicker players={selectedPlayers} positions={[]} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#08111c',
    padding: 16,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
    zIndex: 999,
  },
  dropdownContainer: {
    zIndex: 1000,
  },
  dropdownToggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    backgroundColor: '#08111c',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#08111c',
    borderColor: '#fff',
    borderWidth: 1,
    minWidth: '100%',
    zIndex: 1001,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
