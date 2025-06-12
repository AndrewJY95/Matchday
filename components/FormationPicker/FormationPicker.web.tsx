// components\FormationPicker\FormationPicker.web.tsx

console.log('✅ FormationPicker.web.tsx loaded');

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const initialPlayers = [];
export const initialPositions = [];
export const formationPositions = {
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
};

const FormationPickerWebFallback: React.FC = () => {
  console.warn('⚠️ FormationPicker fallback props received');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Formation Picker is not supported on the web. Please test in Expo Go or a simulator.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FormationPickerWebFallback;
