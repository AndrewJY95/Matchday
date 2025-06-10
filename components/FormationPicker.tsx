import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated,
{
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

const POSITION_SIZE = 40;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
};

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
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
});

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
  isSelected?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragMove?: (x: number, y: number) => void;
}

// Animated components
const AnimatedView = Animated.createAnimatedComponent(View);

const PlayerDot = React.memo<PlayerDotProps>(({ 
  player, 
  isSelected,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(1.1, SPRING_CONFIG);
      opacity.value = withSpring(0.8, SPRING_CONFIG);
      if (onDragStart) {
        runOnJS(onDragStart)();
      }
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      if (onDragMove) {
        runOnJS(onDragMove)(event.absoluteX, event.absoluteY);
      }
    },
    onEnd: () => {
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
      opacity.value = withSpring(1, SPRING_CONFIG);
      if (onDragEnd) {
        runOnJS(onDragEnd)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <AnimatedView
        style={[
          styles.playerDot,
          { backgroundColor: player.color || '#fff' },
          isSelected && styles.selectedPlayer,
          Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
            android: {
              elevation: 5,
            },
            web: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
            },
          }),
          animatedStyle,
        ]}
      >
        <Text numberOfLines={1} style={styles.playerText}>{player.number}</Text>
      </AnimatedView>
    </PanGestureHandler>
  );
});

PlayerDot.displayName = 'PlayerDot';

interface PositionDotProps {
  position: Position;
  isDropTarget: boolean;
  isSelected: boolean;
  style?: any;
}

const PositionDot = React.memo<PositionDotProps>(({ position, isDropTarget, isSelected, style }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isDropTarget) {
      scale.value = withSpring(1.2, SPRING_CONFIG);
      opacity.value = withSpring(0.8, SPRING_CONFIG);
    } else {
      scale.value = withSpring(1, SPRING_CONFIG);
      opacity.value = withSpring(1, SPRING_CONFIG);
    }
  }, [isDropTarget]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.positionDot,
        isDropTarget && styles.dropTarget,
        style,
        animatedStyle,
      ]}
    >
      {position.player ? (
        <PlayerDot
          player={position.player}
          isSelected={isSelected}
        />
      ) : (
        <Text style={styles.positionLabel}>{position.label}</Text>
      )}
    </Animated.View>
  );
});

PositionDot.displayName = 'PositionDot';

export interface FormationPickerProps {
  players?: Player[];
  positions?: Position[];
  onChange?: (data: { players: Player[]; positions: Position[] }) => void;
}

export default function FormationPicker({ 
  players: playersProp,
  positions: positionsProp,
  onChange 
}: FormationPickerProps) {
  const [players, setPlayers] = useState<Player[]>(playersProp ?? initialPlayers);
  const [positions, setPositions] = useState<Position[]>(positionsProp ?? initialPositions);
  const [draggingPlayer, setDraggingPlayer] = useState<{
    player: Player;
    fromPosition?: Position;
  } | null>(null);
  const pitchRef = useRef<View>(null);
  const [dropTarget, setDropTarget] = useState<Position | null>(null);

  useEffect(() => {
    if (playersProp) setPlayers(playersProp);
  }, [playersProp]);

  useEffect(() => {
    if (positionsProp) setPositions(positionsProp);
  }, [positionsProp]);

  const handleChange = useCallback(() => {
    onChange?.({ players, positions });
  }, [players, positions, onChange]);

  useEffect(() => {
    const timeoutId = setTimeout(handleChange, 0);
    return () => clearTimeout(timeoutId);
  }, [handleChange]);

  const findDropPosition = useCallback((x: number, y: number): Promise<Position | null> => {
    return new Promise((resolve) => {
      const pitch = pitchRef.current;
      if (!pitch) {
        resolve(null);
        return;
      }

      pitch.measure((offsetX, offsetY, width, height, pageX, pageY) => {
        // Convert absolute coordinates to relative (0-100%)
        const relativeX = ((x - pageX) / width) * 100;
        const relativeY = ((y - pageY) / height) * 100;

        // Find closest position within threshold
        const threshold = 10; // % of pitch width/height
        const closest = positions.reduce((closest: Position | null, position) => {
          const distance = Math.sqrt(
            Math.pow(position.x - relativeX, 2) + 
            Math.pow(position.y - relativeY, 2)
          );
          
          if (distance < threshold) {
            if (!closest || distance < Math.sqrt(
              Math.pow(closest.x - relativeX, 2) + 
              Math.pow(closest.y - relativeY, 2)
            )) {
              return position;
            }
          }
          return closest;
        }, null);

        resolve(closest);
      });
    });
  }, [positions]);

  const handleDragStart = useCallback((player: Player, fromPosition?: Position) => {
    setDraggingPlayer({ player, fromPosition });
  }, []);

  const handleDragMove = useCallback(async (x: number, y: number) => {
    const newDropTarget = await findDropPosition(x, y);
    if (newDropTarget?.id !== dropTarget?.id) {
      setDropTarget(newDropTarget);
    }
  }, [findDropPosition, dropTarget]);

  const handleDragEnd = useCallback(() => {
    if (!draggingPlayer || !dropTarget) {
      setDraggingPlayer(null);
      setDropTarget(null);
      return;
    }

    const updatePositions = (prevPositions: Position[]): Position[] => {
      const newPositions = [...prevPositions];
      const targetIndex = newPositions.findIndex(p => p.id === dropTarget.id);
      const sourceIndex = draggingPlayer.fromPosition 
        ? newPositions.findIndex(p => p.id === draggingPlayer.fromPosition!.id)
        : -1;

      if (dropTarget.player) {
        if (sourceIndex !== -1) {
          // Swap between positions
          newPositions[targetIndex] = { ...dropTarget, player: draggingPlayer.player };
          newPositions[sourceIndex] = { ...newPositions[sourceIndex], player: dropTarget.player };
        } else {
          // Move from list to occupied position
          setPlayers(prev => [...prev, dropTarget.player!]);
          newPositions[targetIndex] = { ...dropTarget, player: draggingPlayer.player };
          setPlayers(prev => prev.filter(p => p.id !== draggingPlayer.player.id));
        }
      } else {
        // Move to empty position
        newPositions[targetIndex] = { ...dropTarget, player: draggingPlayer.player };
        if (sourceIndex !== -1) {
          newPositions[sourceIndex] = { ...newPositions[sourceIndex], player: undefined };
        } else {
          setPlayers(prev => prev.filter(p => p.id !== draggingPlayer.player.id));
        }
      }

      return newPositions;
    };

    setPositions(updatePositions);
    setDraggingPlayer(null);
    setDropTarget(null);
  }, [draggingPlayer, dropTarget]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View ref={pitchRef} style={styles.pitch}>
        {positions.map(position => (
          <View
            key={position.id}
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
            <PositionDot
              position={position}
              isDropTarget={!!draggingPlayer && position.id === dropTarget?.id}
              isSelected={draggingPlayer?.fromPosition?.id === position.id}
            />
          </View>
        ))}
      </View>
      <View style={styles.playerList}>
        {players.map(player => (
          <View key={player.id} style={styles.playerWrapper}>
            <PlayerDot
              player={player}
              isSelected={draggingPlayer?.player.id === player.id}
              onDragStart={() => handleDragStart(player)}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          </View>
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

