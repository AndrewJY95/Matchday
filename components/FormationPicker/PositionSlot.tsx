// components/FormationPicker/PositionSlot.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, LayoutRectangle } from 'react-native';
import type { Player } from './types';

interface PositionSlotProps {
  label: string;
  assignedPlayer: Player | null;
  highlighted?: boolean;
  size: number;
  left: string;
  top: string;
  onRemove: () => void;
  onLayout: (layout: LayoutRectangle) => void;
}

const PositionSlot: React.FC<PositionSlotProps> = ({
  label,
  assignedPlayer,
  highlighted = false,
  size,
  left,
  top,
  onRemove,
  onLayout,
}) => {
  return (
    <Pressable
      style={[
        styles.slot,
        { width: size, height: size, borderRadius: size / 2, left, top },
        highlighted && styles.highlight,
      ]}
      onPress={onRemove}
      onLayout={(e) => onLayout(e.nativeEvent.layout)}
    >
      <Text style={styles.text} numberOfLines={1}>
        {assignedPlayer ? assignedPlayer.name : label}
      </Text>
    </Pressable>
  );
};

export default PositionSlot;

const styles = StyleSheet.create({
  slot: {
    position: 'absolute',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
