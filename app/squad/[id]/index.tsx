import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  View,
} from 'react-native';
import FormationPicker, { Player, Position, initialPlayers, initialPositions } from '@/components/FormationPicker';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function SquadScreen() {
  const params = useLocalSearchParams();
  const squadId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [activeTeam, setActiveTeam] = useState<'Home' | 'Away'>('Home');
  const [homeData, setHomeData] = useState({ players: initialPlayers, positions: initialPositions });
  const [awayData, setAwayData] = useState({ players: initialPlayers, positions: initialPositions });

  const handleChange = (data: { players: Player[]; positions: Position[] }) => {
    if (activeTeam === 'Home') {
      setHomeData(data);
    } else {
      setAwayData(data);
    }
  };

  const currentData = activeTeam === 'Home' ? homeData : awayData;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 16,
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
});
