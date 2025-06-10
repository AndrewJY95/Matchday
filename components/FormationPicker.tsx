import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';

const POSITION_SIZE = 40;

// Types
export interface Player {
  id: string;
  number: string;
  color?: string;
  name: string;
}

export interface Position {
  id: PositionId;
  x: number;
  y: number;
  label: string;
  player?: Player;
}

type PositionId = 'GK' | 'LB' | 'LCB' | 'RCB' | 'RB' | 'DM' | 'LM' | 'RM' | 'AM' | 'CF1' | 'CF2';

export const initialPlayers: Player[] = [
  { id: '1', name: 'Player 1', number: '1' },
  { id: '2', name: 'Player 2', number: '2' },
  { id: '3', name: 'Player 3', number: '3' },
  { id: '4', name: 'Player 4', number: '4' },
  { id: '5', name: 'Player 5', number: '5' },
  { id: '6', name: 'Player 6', number: '6' },
  { id: '7', name: 'Player 7', number: '7' },
  { id: '8', name: 'Player 8', number: '8' },
  { id: '9', name: 'Player 9', number: '9' },
  { id: '10', name: 'Player 10', number: '10' },
  { id: '11', name: 'Player 11', number: '11' },
];

export const initialPositions: Position[] = [
  { id: 'GK', label: 'GK', x: 50, y: 90 },
  { id: 'LB', label: 'LB', x: 20, y: 70 },
  { id: 'LCB', label: 'CB', x: 35, y: 70 },
  { id: 'RCB', label: 'CB', x: 65, y: 70 },
  { id: 'RB', label: 'RB', x: 80, y: 70 },
  { id: 'DM', label: 'DM', x: 50, y: 50 },
  { id: 'LM', label: 'LM', x: 20, y: 40 },
  { id: 'RM', label: 'RM', x: 80, y: 40 },
  { id: 'AM', label: 'AM', x: 50, y: 30 },
  { id: 'CF1', label: 'CF', x: 35, y: 20 },
  { id: 'CF2', label: 'CF', x: 65, y: 20 },
];

interface PlayerDotProps {
  player: Player;
  fromPosition?: Position;
  isSelected?: boolean;
  onPress: () => void;
}

export interface FormationPickerProps {
  players?: Player[];
  positions?: Position[];
  onChange?: (data: { players: Player[]; positions: Position[] }) => void;
}

export default function FormationPicker({ players: playersProp, positions: positionsProp, onChange }: FormationPickerProps) {
  const [players, setPlayers] = useState<Player[]>(playersProp ?? initialPlayers);
  const [positions, setPositions] = useState<Position[]>(positionsProp ?? initialPositions);
  useEffect(() => {
    if (playersProp) setPlayers(playersProp);
  }, [playersProp]);
  useEffect(() => {
    if (positionsProp) setPositions(positionsProp);
  }, [positionsProp]);
  useEffect(() => {
    onChange?.({ players, positions });
  }, [players, positions, onChange]);
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player, fromPosition?: Position } | null>(null);

  const handlePositionPress = (position: Position) => {
    if (selectedPlayer) {
      // If there's already a player in the target position
      if (position.player) {
        // If the dragged player is from another position, swap them
        if (selectedPlayer.fromPosition) {
          setPositions(prev =>
            prev.map(pos => {
              if (pos.id === position.id) return { ...pos, player: selectedPlayer.player };
              if (pos.id === selectedPlayer.fromPosition!.id) return { ...pos, player: position.player };
              return pos;
            })
          );
        } else {
          // If the dragged player is from the list, add current position player back to list
          setPlayers(prev => [...prev, position.player!]);
          setPositions(prev =>
            prev.map(pos =>
              pos.id === position.id ? { ...pos, player: selectedPlayer.player } : pos
            )
          );
          setPlayers(prev => prev.filter(p => p.id !== selectedPlayer.player.id));
        }
      } else {
        // Position is empty, simply place the player
        setPositions(prev =>
          prev.map(pos => {
            if (pos.id === position.id) return { ...pos, player: selectedPlayer.player };
            if (selectedPlayer.fromPosition && pos.id === selectedPlayer.fromPosition.id) {
              return { ...pos, player: undefined };
            }
            return pos;
          })
        );
        
        // If player came from the list, remove them from it
        if (!selectedPlayer.fromPosition) {
          setPlayers(prev => prev.filter(p => p.id !== selectedPlayer.player.id));
        }
      }
      setSelectedPlayer(null);
    } else if (position.player) {
      setSelectedPlayer({ player: position.player, fromPosition: position });
    }
  };

  const handlePlayerPress = (player: Player) => {
    if (selectedPlayer?.player.id === player.id) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer({ player });
    }
  };

  const PlayerDot: React.FC<PlayerDotProps> = ({ player, isSelected, onPress }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.playerDot,
        { backgroundColor: player.color || '#fff' },
        { elevation: 5 },
        isSelected && styles.selectedPlayer,
        Platform.OS === 'ios' ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        } : {},
      ]}
    >
      <Text style={styles.playerText}>{player.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pitch}>
        {positions.map((position) => (
          <Pressable
            key={position.id}
            onPress={() => handlePositionPress(position)}
            style={[
              styles.position,
              {
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: [
                  { translateX: -POSITION_SIZE / 2 },
                  { translateY: -POSITION_SIZE / 2 },
                ],
              },
            ]}
          >
            <View style={[styles.positionDot, selectedPlayer && !position.player && styles.dropTarget]}>
              {position.player ? (
                <PlayerDot 
                  player={position.player}
                  fromPosition={position}
                  isSelected={selectedPlayer?.player.id === position.player.id}
                  onPress={() => handlePositionPress(position)}
                />
              ) : (
                <Text style={styles.positionLabel}>{position.label}</Text>
              )}
            </View>
          </Pressable>
        ))}
      </View>
      <View style={styles.playerList}>
        {players.map((player) => (
          <View key={player.id} style={styles.playerWrapper}>
            <PlayerDot
              player={player}
              isSelected={selectedPlayer?.player.id === player.id}
              onPress={() => handlePlayerPress(player)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pitch: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#4a8',
    position: 'relative',
  },
  playerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  playerWrapper: {
    marginHorizontal: 5,
  },
  position: {
    position: 'absolute',
    width: POSITION_SIZE,
    height: POSITION_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionDot: {
    width: POSITION_SIZE,
    height: POSITION_SIZE,
    borderRadius: POSITION_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  playerDot: {
    width: POSITION_SIZE,
    height: POSITION_SIZE,
    borderRadius: POSITION_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  playerText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  selectedPlayer: {
    borderColor: '#007AFF',
    borderWidth: 2,
    opacity: 0.8,
  },
  dropTarget: {
    borderColor: '#007AFF',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
});

