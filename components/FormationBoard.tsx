import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface Player {
  id: string;
  name: string;
  games: number;
  goals: number;
  assists: number;
  position?: string;
}

interface FormationBoardProps {
  slots: (Player | null)[];
  onLayout?: (layout: any) => void;
}

const FormationBoard: React.FC<FormationBoardProps> = ({ slots, onLayout }) => {
  return (
    <View style={styles.board} onLayout={onLayout}>
      {slots.map((player, index) => (
        <View key={index} style={styles.slot}>
          {player ? (
            <Text style={styles.slotText}>{player.name}</Text>
          ) : (
            <Text style={styles.slotText}>Slot {index + 1}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#0f0f23',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  slot: {
    width: '22%',
    height: 60,
    backgroundColor: '#1a1a2e',
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default FormationBoard;
