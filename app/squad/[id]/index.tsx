import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FormationBoard, { Player } from '@/components/FormationBoard';
import DraggablePlayer from '@/components/DraggablePlayer';

export default function SquadScreen() {
  const { id } = useLocalSearchParams();

  const samplePlayers: Player[] = [
    { id: '1', name: 'John Doe', games: 10, goals: 4, assists: 2 },
    { id: '2', name: 'Jane Smith', games: 8, goals: 2, assists: 5 },
    { id: '3', name: 'Alex Johnson', games: 6, goals: 3, assists: 1 },
    { id: '4', name: 'Sam Lee', games: 9, goals: 5, assists: 3 },
    { id: '5', name: 'Chris Paul', games: 7, goals: 1, assists: 4 },
    { id: '6', name: 'Taylor Ray', games: 5, goals: 0, assists: 2 },
    { id: '7', name: 'Jordan Bass', games: 4, goals: 2, assists: 1 },
    { id: '8', name: 'Pat Green', games: 3, goals: 1, assists: 0 },
    { id: '9', name: 'Morgan Cole', games: 2, goals: 0, assists: 0 },
    { id: '10', name: 'Jamie Fox', games: 1, goals: 0, assists: 0 },
    { id: '11', name: 'Riley Dean', games: 0, goals: 0, assists: 0 },
  ];

  const [playerCount, setPlayerCount] = useState(5);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(samplePlayers);
  const [slots, setSlots] = useState<(Player | null)[]>(Array(playerCount).fill(null));
  const [boardLayout, setBoardLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const changePlayerCount = (count: number) => {
    const newCount = Math.min(11, Math.max(5, count));
    setPlayerCount(newCount);
    setSlots((prev) => {
      const updated = [...prev];
      if (updated.length > newCount) updated.length = newCount;
      while (updated.length < newCount) updated.push(null);
      return updated;
    });
  };

  const handleDrop = (player: Player, pos: { x: number; y: number }) => {
    if (!boardLayout) return;
    if (
      pos.x >= boardLayout.x &&
      pos.x <= boardLayout.x + boardLayout.width &&
      pos.y >= boardLayout.y &&
      pos.y <= boardLayout.y + boardLayout.height
    ) {
      const index = slots.findIndex((s) => s === null);
      if (index !== -1) {
        const updatedSlots = [...slots];
        updatedSlots[index] = player;
        setSlots(updatedSlots);
        setAvailablePlayers((prev) => prev.filter((p) => p.id !== player.id));
      }
    }
  };

  const autoAssign = () => {
    const openIndices = slots.map((p, i) => (p ? -1 : i)).filter((i) => i !== -1) as number[];
    const toAssign = availablePlayers.slice(0, openIndices.length);
    const updatedSlots = [...slots];
    toAssign.forEach((p, idx) => {
      updatedSlots[openIndices[idx]] = p;
    });
    setSlots(updatedSlots);
    setAvailablePlayers((prev) => prev.filter((p) => !toAssign.includes(p)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Squad {id}</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.countButton} onPress={() => changePlayerCount(playerCount - 1)}>
          <Text style={styles.countText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.countLabel}>{playerCount} Players</Text>
        <TouchableOpacity style={styles.countButton} onPress={() => changePlayerCount(playerCount + 1)}>
          <Text style={styles.countText}>+</Text>
        </TouchableOpacity>
      </View>

      <FormationBoard slots={slots} onLayout={(e) => setBoardLayout(e.nativeEvent.layout)} />

      <Text style={styles.subtitle}>Available Players</Text>
      <View style={styles.availableList}>
        {availablePlayers.map((p) => (
          <DraggablePlayer key={p.id} player={p} onDrop={handleDrop} />
        ))}
      </View>

      <TouchableOpacity style={styles.autoButton} onPress={autoAssign}>
        <Text style={styles.autoButtonText}>Auto Assign</Text>
      </TouchableOpacity>
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  countButton: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  countText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countLabel: {
    color: '#fff',
    fontSize: 16,
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  availableList: {
    paddingHorizontal: 20,
  },
  autoButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  autoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
