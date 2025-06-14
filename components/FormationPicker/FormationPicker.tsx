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
  positions: Position[]; // ✅ reintroduced to match prop usage
}

export const formationPositions: Record<number, Position[]> = {
  // ... your 5–11-a-side positions (already in place)
  // unchanged from your latest message
};

const FormationPicker: React.FC<FormationPickerProps> = ({ players, positions }) => {
  const { width } = useWindowDimensions();
  const nodeSize = Math.max(40, width * 0.12);

  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(players);
  const [slots, setSlots] = useState<Position[]>([]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const layouts = useRef<Record<string, LayoutRectangle>>({});

  useEffect(() => {
  const formation = formationPositions[players.length] || formationPositions[11];
  if (!formation) return;

  setSlots(formation.map((p) => ({ ...p, player: null })));
  setAvailablePlayers(players);
  }, [players]);


  const findSlotAt = (x: number, y: number) => {
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
      <View style={styles.pitch}>
        <Image
          source={require('@/assets/images/pitch.png')}
          style={styles.pitchImage}
          resizeMode="contain"
        />
        {slots.map((slot) => (
          <PositionSlot
            key={slot.id}
            label={slot.label}
            assignedPlayer={slot.player || null}
            highlighted={highlighted === slot.id}
            size={nodeSize}
            left={`${slot.x}%`}
            top={`${slot.y}%`}
            onRemove={() => handleRemove(slot.id)}
            onLayout={(layout) => {
              layouts.current[slot.id] = layout;
            }}
          />
        ))}
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
