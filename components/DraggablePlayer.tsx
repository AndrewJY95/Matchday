import React, { useRef } from 'react';
import { Animated, PanResponder, Text, StyleSheet } from 'react-native';
import { Player } from './FormationBoard';

interface Props {
  player: Player;
  onDrop: (player: Player, pos: { x: number; y: number }) => void;
}

const DraggablePlayer: React.FC<Props> = ({ player, onDrop }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        onDrop(player, { x: gesture.moveX, y: gesture.moveY });
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.player, pan.getLayout()]} {...panResponder.panHandlers}>
      <Text style={styles.text}>{player.name}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  player: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    color: '#fff',
  },
});

export default DraggablePlayer;
