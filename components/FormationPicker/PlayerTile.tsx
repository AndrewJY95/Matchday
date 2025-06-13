import React, { forwardRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { DraxView } from 'react-native-drax';
import type { Player } from './FormationPicker';

interface PlayerTileProps {
  player: Player;
}

const PlayerTile = forwardRef<any, PlayerTileProps>(({ player }, ref) => (
  <DraxView
    ref={ref}
    style={styles.container}
    draggingStyle={styles.dragging}
    dragReleasedStyle={styles.dragging}
    hoverDraggingStyle={styles.hoverDragging}
    longPressDelay={150}
    dragPayload={player.id}
  >
    <Text style={styles.name}>{player.name}</Text>
  </DraxView>
));

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dragging: {
    opacity: 0.2,
  },
  hoverDragging: {
    borderWidth: 1,
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
});

export default PlayerTile;
