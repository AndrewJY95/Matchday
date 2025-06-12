// components\FormationPicker\FormationPicker.tsx
console.log("🚫 FormationPicker.tsx loaded");


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { DraxView } from 'react-native-drax';

export interface Player {
  id: string;
  name: string;
  number?: string;
  color?: string;
}

export interface Position {
  id: string;
  x: number;
  y: number;
  label: string;
  player?: Player;
}

export interface FormationPickerProps {
  players: Player[];
  positions: Position[];
  onChange?: (data: { players: Player[]; positions: Position[] }) => void;
}

export const initialPlayers: Player[] = [
  { id: '1', name: 'Marcus', number: '1' },
  { id: '2', name: 'James', number: '2' },
  { id: '3', name: 'Alex', number: '3' },
  { id: '4', name: 'David', number: '4' },
  { id: '5', name: 'Chris', number: '5' },
  { id: '6', name: 'Michael', number: '6' },
  { id: '7', name: 'Robert', number: '7' },
  { id: '8', name: 'Daniel', number: '8' },
  { id: '9', name: 'Luke', number: '9' },
  { id: '10', name: 'Oliver', number: '10' },
  { id: '11', name: 'Jack', number: '11' },
];

export const initialPositions: Position[] = [
  { id: 'GK', label: 'GK', x: 50, y: 90 },
  { id: 'LB', label: 'LB', x: 20, y: 70 },
  { id: 'CB1', label: 'CB', x: 40, y: 70 },
  { id: 'CB2', label: 'CB', x: 60, y: 70 },
  { id: 'RB', label: 'RB', x: 80, y: 70 },
  { id: 'LM', label: 'LM', x: 20, y: 45 },
  { id: 'CM1', label: 'CM', x: 40, y: 45 },
  { id: 'CM2', label: 'CM', x: 60, y: 45 },
  { id: 'RM', label: 'RM', x: 80, y: 45 },
  { id: 'ST1', label: 'ST', x: 40, y: 20 },
  { id: 'ST2', label: 'ST', x: 60, y: 20 },
];

export const formationPositions: Record<number, Position[]> = {
  // 5-a-side: 1-2-1-1
  5: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'CB', label: 'CB', x: 50, y: 70 },
    { id: 'LM', label: 'LM', x: 30, y: 50 },
    { id: 'RM', label: 'RM', x: 70, y: 50 },
    { id: 'CF', label: 'CF', x: 50, y: 25 },
  ],

  // 6-a-side: 2-2-1
  6: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'CB1', label: 'CB', x: 40, y: 70 },
    { id: 'CB2', label: 'CB', x: 60, y: 70 },
    { id: 'LM', label: 'LM', x: 30, y: 50 },
    { id: 'RM', label: 'RM', x: 70, y: 50 },
    { id: 'CF', label: 'CF', x: 50, y: 25 },
  ],

  // 7-a-side: 2-3-1
  7: [
    { id: 'GK', label: 'GK', x: 50, y: 90 },
    { id: 'CB1', label: 'CB', x: 40, y: 70 },
    { id: 'CB2', label: 'CB', x: 60, y: 70 },
    { id: 'LM', label: 'LM', x: 20, y: 55 },
    { id: 'CM', label: 'CM', x: 50, y: 50 },
    { id: 'RM', label: 'RM', x: 80, y: 55 },
    { id: 'CF', label: 'CF', x: 50, y: 25 },
  ],

  // 8-a-side: 3-3-1
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

  // 9-a-side: 3-2-3
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

  // 10-a-side: 4-3-2
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

  // 11-a-side: 4-1-2-1-2
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

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  positionNode: {
    position: 'absolute',
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerList: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  playerItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const FormationPicker: React.FC<FormationPickerProps> = ({ players, positions }) => {
  const { width } = useWindowDimensions();
  const nodeSize = Math.max(40, width * 0.12);

  return (
    <View style={styles.container}>
      <View style={styles.pitch}>
        <Image
          source={require('@/assets/images/pitch.png')}
          style={styles.pitchImage}
          resizeMode="contain"
        />
        {positions.map((pos) => (
          <DraxView
            key={pos.id}
            style={[
              styles.positionNode,
              {
                width: nodeSize,
                height: nodeSize,
                borderRadius: nodeSize / 2,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                marginLeft: -nodeSize / 2,
                marginTop: -nodeSize / 2,
              },
            ]}
            onReceiveDragDrop={() => {}}
          >
            <Text style={styles.positionText}>{pos.label}</Text>
          </DraxView>
        ))}
      </View>
      <View style={styles.playerList}>
        {players.slice(0, positions.length).map((player) => (
          <Pressable key={player.id} style={styles.playerItem}>
            <Text style={styles.playerName}>{player.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default FormationPicker;
