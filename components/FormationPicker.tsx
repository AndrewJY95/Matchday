import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  LayoutRectangle,
  PanResponderGestureState,
} from 'react-native';

interface Player {
  id: string;
  name: string;
}

interface Position {
  id: string;
  label: string;
  player?: Player;
  layout?: LayoutRectangle;
}

const DEFAULT_PLAYERS: Player[] = [
  { id: '1', name: 'Player 1' },
  { id: '2', name: 'Player 2' },
  { id: '3', name: 'Player 3' },
  { id: '4', name: 'Player 4' },
  { id: '5', name: 'Player 5' },
  { id: '6', name: 'Player 6' },
  { id: '7', name: 'Player 7' },
  { id: '8', name: 'Player 8' },
  { id: '9', name: 'Player 9' },
  { id: '10', name: 'Player 10' },
  { id: '11', name: 'Player 11' },
];

export default function FormationPicker() {
  const pitchRef = useRef<View>(null);

  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [positions, setPositions] = useState<Position[]>([
    { id: 'GK', label: 'GK' },
    { id: 'LB', label: 'LB' },
    { id: 'LCB', label: 'CB' },
    { id: 'RCB', label: 'CB' },
    { id: 'RB', label: 'RB' },
    { id: 'DM', label: 'DM' },
    { id: 'LM', label: 'LM' },
    { id: 'RM', label: 'RM' },
    { id: 'AM', label: 'AM' },
    { id: 'CF1', label: 'CF' },
    { id: 'CF2', label: 'CF' },
  ]);

  const handleDrop = (
    gesture: PanResponderGestureState,
    player: Player,
  ) => {
    if (!pitchRef.current) return;
    pitchRef.current.measure((x, y, width, height, pageX, pageY) => {
      const localX = gesture.moveX - pageX;
      const localY = gesture.moveY - pageY;
      const dropPosition = positions.find((p) => {
        const l = p.layout;
        return (
          l &&
          localX >= l.x &&
          localX <= l.x + l.width &&
          localY >= l.y &&
          localY <= l.y + l.height
        );
      });
      if (dropPosition) {
        setPositions((prev) =>
          prev.map((p) =>
            p.id === dropPosition.id ? { ...p, player } : p,
          ),
        );
        setPlayers((prev) => prev.filter((pl) => pl.id !== player.id));
      }
    });
  };

  const renderPlayer = (player: Player) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false },
        ),
        onPanResponderRelease: (_, gesture) => {
          handleDrop(gesture, player);
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        },
      }),
    ).current;

    return (
      <Animated.View
        key={player.id}
        style={[styles.playerToken, pan.getLayout()]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.playerName}>{player.name}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View ref={pitchRef} style={styles.pitch}>
        {positions.map((pos) => (
          <View
            key={pos.id}
            style={[styles.position, positionStyles[pos.id]]}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout;
              setPositions((prev) =>
                prev.map((p) =>
                  p.id === pos.id ? { ...p, layout } : p,
                ),
              );
            }}
          >
            <Text style={styles.positionLabel}>
              {pos.player ? pos.player.name : pos.label}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.playerList}>{players.map(renderPlayer)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pitch: {
    width: '100%',
    aspectRatio: 0.65,
    backgroundColor: '#0b6623',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  position: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  positionLabel: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  playerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  playerToken: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 4,
  },
  playerName: {
    color: '#fff',
    fontSize: 12,
  },
});

const positionStyles = StyleSheet.create({
  GK: { bottom: '5%', left: '50%', marginLeft: -20 },
  LB: { bottom: '25%', left: '15%', marginLeft: -20 },
  LCB: { bottom: '30%', left: '35%', marginLeft: -20 },
  RCB: { bottom: '30%', left: '65%', marginLeft: -20 },
  RB: { bottom: '25%', left: '85%', marginLeft: -20 },
  DM: { bottom: '45%', left: '50%', marginLeft: -20 },
  LM: { bottom: '55%', left: '25%', marginLeft: -20 },
  RM: { bottom: '55%', left: '75%', marginLeft: -20 },
  AM: { bottom: '65%', left: '50%', marginLeft: -20 },
  CF1: { bottom: '80%', left: '40%', marginLeft: -20 },
  CF2: { bottom: '80%', left: '60%', marginLeft: -20 },
});

