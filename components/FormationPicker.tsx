import React from 'react';
import { View, Text, StyleSheet, Image, Platform, Pressable } from 'react-native';

// Types and interfaces
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

interface FormationPickerProps {
  players?: Player[];
  positions?: Position[];
  onChange?: (data: { players: Player[]; positions: Position[] }) => void;
}

// Default positions for 4-4-2 formation
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
  { id: 'ST2', label: 'ST', x: 60, y: 20 }
];

export const initialPlayers: Player[] = [
  { id: '1', name: 'Marcus', number: '1' },
  { id: '2', name: 'James', number: '2' },
  { id: '3', name: 'Alex', number: '3' },
  { id: '4', name: 'David', number: '4' },
  { id: '5', name: 'Chris', number: '5' },
  { id: '6', name: 'Michael', number: '6' },
  { id: '7', name: 'Robert', number: '7' }
];

export const formationPositions: Record<number, Position[]> = {
  5: initialPositions,
  6: initialPositions,
  7: initialPositions,
  8: initialPositions,
  9: initialPositions,
  10: initialPositions,
  11: initialPositions
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pitch: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  pitchImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playerList: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },  playerItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const FormationPicker: React.FC<FormationPickerProps> = ({ 
  players = initialPlayers,
  positions = initialPositions,
  onChange 
}) => {
  return (
    <View style={styles.container}>      <View style={styles.pitch}>
        <Image 
          source={require('@/assets/images/pitch.png')}
          style={[styles.pitchImage, { resizeMode: 'contain' }]}
        />
      </View>      <View style={styles.playerList}>
        {players.slice(0, positions?.length || players.length).map(player => (
          <Pressable key={player.id} style={styles.playerItem}>
            <Text style={styles.playerName}>{player.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default FormationPicker;

