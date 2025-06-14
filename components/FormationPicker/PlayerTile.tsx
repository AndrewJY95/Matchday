// components/FormationPicker/PlayerTile.tsx
import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import type { Player } from './types';

const { width } = Dimensions.get('window');
const DRAG_THRESHOLD_Y = 150;

interface PlayerTileProps {
  player: Player;
  onDrop: (player: Player) => void;
}

const PlayerTile: React.FC<PlayerTileProps> = ({ player, onDrop }) => {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = offsetX.value;
      ctx.startY = offsetY.value;
    },
    onActive: (event, ctx) => {
      offsetX.value = ctx.startX + event.translationX;
      offsetY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      if (offsetY.value < -DRAG_THRESHOLD_Y) {
        runOnJS(onDrop)(player);
      }
      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.tile, animatedStyle]}>
        <Text style={styles.name}>{player.name}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default PlayerTile;

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    minWidth: width * 0.4,
    alignItems: 'center',
    margin: 6,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#08111c',
  },
});
