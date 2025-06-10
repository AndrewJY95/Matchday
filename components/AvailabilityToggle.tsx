import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  available: boolean;
  onToggle: (value: boolean) => void;
}

export default function AvailabilityToggle({ available, onToggle }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="available-button"
        style={[
          styles.button,
          available ? styles.available : styles.unselected,
        ]}
        onPress={() => onToggle(true)}
      >
        <Ionicons
          name="checkmark"
          size={20}
          color={available ? '#fff' : '#4CAF50'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        testID="unavailable-button"
        style={[
          styles.button,
          !available ? styles.unavailable : styles.unselected,
        ]}
        onPress={() => onToggle(false)}
      >
        <Ionicons
          name="close"
          size={20}
          color={!available ? '#fff' : '#F44336'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  available: {
    backgroundColor: '#4CAF50',
  },
  unavailable: {
    backgroundColor: '#F44336',
  },
  unselected: {
    backgroundColor: '#333',
  },
});
