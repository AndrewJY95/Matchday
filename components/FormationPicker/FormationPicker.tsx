// components/FormationPicker/FormationPicker.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PlayerTile from './PlayerTile';
import type { Player } from './types';

interface FormationPickerProps {
  players: Player[];
  positions: any[]; // Placeholder — not used yet in the simplified version
}

const FormationPicker: React.FC<FormationPickerProps> = ({ players }) => {
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(players);
  const [assignedPlayer, setAssignedPlayer] = useState<Player | null>(null);

  const handleDrop = (player: Player) => {
    setAssignedPlayer(player);
    setAvailablePlayers((prev) => prev.filter((p) => p.id !== player.id));
  };

  const handleRemove = () => {
    if (assignedPlayer) {
      setAvailablePlayers((prev) => [...prev, assignedPlayer]);
      setAssignedPlayer(null);
    }
  };

  const reset = () => {
    setAssignedPlayer(null);
    setAvailablePlayers(players);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drop onto CF</Text>

      <View style={styles.pitch}>
        <Pressable style={styles.positionSlot} onPress={handleRemove}>
          <Text style={styles.positionText}>
            {assignedPlayer ? assignedPlayer.name : 'CF'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {availablePlayers.map((player) => (
          <PlayerTile key={player.id} player={player} onDrop={handleDrop} />
        ))}
      </View>

      <Pressable onPress={reset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
    </View>
  );
};

export default FormationPicker;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08111c', padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  pitch: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#112233',
    borderRadius: 10,
    marginBottom: 20,
  },
  positionSlot: {
    width: 100,
    height: 100,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  positionText: { color: '#fff', fontWeight: 'bold' },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'center',
  },
  resetText: { color: '#08111c', fontWeight: 'bold' },
});
