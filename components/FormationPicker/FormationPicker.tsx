// components/FormationPicker/FormationPicker.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  LayoutRectangle,
  useWindowDimensions,
} from 'react-native';
import PlayerTile from './PlayerTile';
import PositionSlot from './PositionSlot';
import type { Player, Position } from './types';

interface FormationPickerProps {
  players: Player[];
  positions?: Position[];
}

export const formationPositions: Record<number, Position[]> = {
  5: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'CB', label: 'CB', x: 50, y: 70 },
    { id: 'LM', label: 'LM', x: 30, y: 50 },
    { id: 'RM', label: 'RM', x: 70, y: 50 },
    { id: 'CF', label: 'CF', x: 50, y: 25 },
  ],
  6: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'CB1', label: 'CB', x: 40, y: 70 },
    { id: 'CB2', label: 'CB', x: 60, y: 70 },
    { id: 'LM', label: 'LM', x: 30, y: 50 },
    { id: 'RM', label: 'RM', x: 70, y: 50 },
    { id: 'CF', label: 'CF', x: 50, y: 25 },
  ],
  7: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'CB1', label: 'CB', x: 40, y: 70 },
    { id: 'CB2', label: 'CB', x: 60, y: 70 },
    { id: 'LM', label: 'LM', x: 20, y: 55 },
    { id: 'CM', label: 'CM', x: 50, y: 50 },
    { id: 'RM', label: 'RM', x: 80, y: 55 },
    { id: 'CF', label: 'CF', x: 50, y: 25 },
  ],
  8: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'LB', label: 'LB', x: 20, y: 70 },
    { id: 'CB', label: 'CB', x: 50, y: 70 },
    { id: 'RB', label: 'RB', x: 80, y: 70 },
    { id: 'LM', label: 'LM', x: 30, y: 50 },
    { id: 'CM', label: 'CM', x: 50, y: 50 },
    { id: 'RM', label: 'RM', x: 70, y: 50 },
    { id: 'CF', label: 'CF', x: 50, y: 25 },
  ],
  9: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'LB', label: 'LB', x: 20, y: 70 },
    { id: 'CB', label: 'CB', x: 50, y: 70 },
    { id: 'RB', label: 'RB', x: 80, y: 70 },
    { id: 'CM', label: 'CM', x: 40, y: 55 },
    { id: 'DM', label: 'DM', x: 60, y: 60 },
    { id: 'LW', label: 'LW', x: 25, y: 25 },
    { id: 'CF', label: 'CF', x: 50, y: 20 },
    { id: 'RW', label: 'RW', x: 75, y: 25 },
  ],
  10: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'LB', label: 'LB', x: 15, y: 70 },
    { id: 'CB1', label: 'CB', x: 35, y: 70 },
    { id: 'CB2', label: 'CB', x: 65, y: 70 },
    { id: 'RB', label: 'RB', x: 85, y: 70 },
    { id: 'LM', label: 'LM', x: 30, y: 50 },
    { id: 'CM', label: 'CM', x: 50, y: 50 },
    { id: 'RM', label: 'RM', x: 70, y: 50 },
    { id: 'CF1', label: 'CF', x: 40, y: 25 },
    { id: 'CF2', label: 'CF', x: 60, y: 25 },
  ],
  11: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'LB', label: 'LB', x: 20, y: 70 },
    { id: 'CB1', label: 'CB', x: 40, y: 70 },
    { id: 'CB2', label: 'CB', x: 60, y: 70 },
    { id: 'RB', label: 'RB', x: 80, y: 70 },
    { id: 'DM', label: 'DM', x: 50, y: 60 },
    { id: 'LM', label: 'LM', x: 30, y: 45 },
    { id: 'RM', label: 'RM', x: 70, y: 45 },
    { id: 'AM', label: 'AM', x: 50, y: 35 },
    { id: 'CF1', label: 'CF', x: 40, y: 20 },
    { id: 'CF2', label: 'CF', x: 60, y: 20 },
  ],
};

const FormationPicker: React.FC<FormationPickerProps> = ({ players, positions }) => {
  const { width } = useWindowDimensions();
  const nodeSize = Math.max(40, width * 0.12);

  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(players);
  const [slots, setSlots] = useState<Position[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const layouts = useRef<Record<string, LayoutRectangle>>({});
  const [pitchLayout, setPitchLayout] = useState<LayoutRectangle | null>(null);
  const pitchRef = useRef<View>(null);
  const [pitchOffset, setPitchOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const formation =
      positions && positions.length > 0
        ? positions
        : formationPositions[players.length] || formationPositions[11];
    if (!formation) return;

    setSlots(formation.map((p) => ({ ...p, player: null })));
    setAvailablePlayers(players);
  }, [players, positions]);


  const findSlotAt = (absX: number, absY: number) => {
    if (!pitchLayout) return undefined;
    const x = absX - pitchOffset.x;
    const y = absY - pitchOffset.y;
    return Object.entries(layouts.current).find(([, rect]) =>
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  };

  const handleDrag = (x: number, y: number) => {
    const entry = findSlotAt(x, y);
    if (!entry) {
      if (highlighted) setHighlighted(null);
      return;
    }
    const [id] = entry;
    const slot = slots.find((s) => s.id === id);
    if (slot && !slot.player) setHighlighted(id);
    else if (highlighted) setHighlighted(null);
  };

  const handleDrop = (player: Player, x: number, y: number) => {
    const entry = findSlotAt(x, y);
    setHighlighted(null);
    if (!entry) return;
    const [id] = entry;
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, player } : s))
    );
    setAvailablePlayers((prev) => prev.filter((p) => p.id !== player.id));
  };

  const handleRemove = (slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot?.player) return;
    setAvailablePlayers((prev) => [...prev, slot.player as Player]);
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, player: null } : s))
    );
  };

  const reset = () => {
    setSlots((prev) => prev.map((s) => ({ ...s, player: null })));
    setAvailablePlayers(players);
  };

  return (
    <View style={styles.container}>
      <View
        ref={pitchRef}
        style={styles.pitch}
        onLayout={(e) => {
          setPitchLayout(e.nativeEvent.layout);
          pitchRef.current?.measureInWindow((x, y, width, height) => {
            setPitchOffset({ x, y });
          });
        }}
      >
        <Image
          source={require('@/assets/images/pitch.png')}
          style={styles.pitchImage}
          resizeMode="contain"
        />
        {slots.map((slot) => {
          const left =
            pitchLayout?.width != null
              ? (slot.x / 100) * pitchLayout.width - nodeSize / 2
              : 0;
          const top =
            pitchLayout?.height != null
              ? (slot.y / 100) * pitchLayout.height - nodeSize / 2
              : 0;
          layouts.current[slot.id] = { x: left, y: top, width: nodeSize, height: nodeSize };
          return (
            <PositionSlot
              key={slot.id}
              label={slot.label}
              assignedPlayer={slot.player || null}
              highlighted={highlighted === slot.id}
              size={nodeSize}
              left={left}
              top={top}
              onRemove={() => handleRemove(slot.id)}
            />
          );
        })}
      </View>

      <View style={styles.list}>
        {availablePlayers.map((player) => (
          <PlayerTile
            key={player.id}
            player={player}
            onDrag={handleDrag}
            onDrop={handleDrop}
          />
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
  pitch: {
    width: '100%',
    aspectRatio: 2 / 3,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  pitchImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
