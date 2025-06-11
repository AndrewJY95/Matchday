// components\FormationPicker.web.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FormationPickerWebFallback: React.FC = () => {
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
