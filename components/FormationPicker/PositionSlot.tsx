import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DraxView } from 'react-native-drax';
import { Ionicons } from '@expo/vector-icons';
import type { Position } from './FormationPicker';

interface PositionSlotProps {
  position: Position;
  nodeSize: number;
  onReceive: (playerId: string) => void;
  onRemove: () => void;
}

const PositionSlot: React.FC<PositionSlotProps> = ({
  position,
  nodeSize,
  onReceive,
  onRemove,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <DraxView
      receptive
      style={[
        styles.node,
        {
          width: nodeSize,
          height: nodeSize,
          borderRadius: nodeSize / 2,
          left: `${position.x}%`,
          top: `${position.y}%`,
          marginLeft: -nodeSize / 2,
          marginTop: -nodeSize / 2,
        },
        hover && styles.nodeHover,
      ]}
      onReceiveDragEnter={() => setHover(true)}
      onReceiveDragExit={() => setHover(false)}
      onReceiveDragDrop={({ dragged }) => {
        const payload = dragged?.payload as string;
        if (payload) onReceive(payload);
        setHover(false);
      }}
    >
      <Text style={styles.label} numberOfLines={1}>
        {position.player ? position.player.name : position.label}
      </Text>
      {position.player && (
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="close" size={12} color="#fff" />
        </Pressable>
      )}
    </DraxView>
  );
};

const styles = StyleSheet.create({
  node: {
    position: 'absolute',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeHover: {
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{ scale: 1.1 }],
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 2,
  },
});

export default PositionSlot;
