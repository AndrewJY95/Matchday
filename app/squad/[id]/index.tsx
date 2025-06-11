// app/squad/[id]/index.tsx

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
} from 'react-native';
import FormationPicker, {
  Player,
  Position,
  initialPlayers,
  formationPositions,
  initialPositions,
} from '@/components/FormationPicker';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SquadScreen() {
  const params = useLocalSearchParams();
  const squadId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [playerCount, setPlayerCount] = useState(11);

  const [activeTeam, setActiveTeam] = useState<'Home' | 'Away'>('Home');
  const [homeData, setHomeData] = useState({ players: initialPlayers, positions: initialPositions });
  const [awayData, setAwayData] = useState({ players: initialPlayers, positions: initialPositions });
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (data: { players: Player[]; positions: Position[] }) => {
    if (activeTeam === 'Home') {
      setHomeData(data);
    } else {
      setAwayData(data);
    }
  };

  useEffect(() => {
    const formation = formationPositions[playerCount];
    const players = initialPlayers.slice(0, playerCount);
    setHomeData({ players, positions: formation });
    setAwayData({ players, positions: formation });
  }, [playerCount]);

  const currentData = activeTeam === 'Home' ? homeData : awayData;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.selectionRow}>
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => setActiveTeam('Home')}
            style={[styles.toggleButton, activeTeam === 'Home' && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleText, activeTeam === 'Home' && styles.toggleTextActive]}>Home</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTeam('Away')}
            style={[styles.toggleButton, activeTeam === 'Away' && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleText, activeTeam === 'Away' && styles.toggleTextActive]}>Away</Text>
          </Pressable>
        </View>
        <View style={styles.dropdownContainer}>
          <Pressable onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdownToggle}>
            <Text style={styles.toggleText}>{playerCount} Players ▾</Text>
          </Pressable>
          {showDropdown && (
            <View style={[styles.dropdownMenu, { elevation: 1000 }]}>
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
      <FormationPicker
        players={currentData.players}
        positions={currentData.positions}
        onChange={handleChange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#08111c',
    padding: 16,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: '#08111c',
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    elevation: 999,
    zIndex: 999,
  },
  dropdownContainer: {
    marginLeft: 'auto',
    elevation: 1000,
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
    elevation: 1001,
    zIndex: 1001,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
