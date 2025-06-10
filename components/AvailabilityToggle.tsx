import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  available: boolean;
  onToggle: () => void;
}

export default function AvailabilityToggle({ available, onToggle }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle();
  };

  const backgroundColor = available ? '#4CAF50' : '#F44336';
  const icon = available ? 'checkmark' : 'close';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={handlePress}
      >
        <Ionicons name={icon} size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
