// components/FormationPicker/PositionSlot.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Player } from './types';

interface PositionSlotProps {
  label: string;
  assignedPlayer: Player | null;
  onRemove: () => void;
}

const PositionSlot: React.FC<PositionSlotProps> = ({ label, assignedPlayer, onRemove }) => {
  return (
    <Pressable style={styles.slot} onPress={onRemove}>
      <Text style={styles.text}>
        {assignedPlayer ? assignedPlayer.name : label}
      </Text>
    </Pressable>
  );
};

export default PositionSlot;

const styles = StyleSheet.create({
  slot: {
    width: 100,
    height: 100,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
