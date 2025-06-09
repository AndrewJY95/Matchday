import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useUserProfile, ProfileData } from './UserProfileContext';


const positions = ['GK','CB','RB','LB','CDM','CM','CAM','RW','LW','ST'];

export default function UserProfileModal() {
  const { profile, saveProfile: persistProfile } = useUserProfile();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');

  useEffect(() => {
    if (!profile) {
      setVisible(true);
    }
  }, [profile]);

  const saveProfile = async () => {
    const data: ProfileData = {
      name,
      location,
      primaryPosition: primary,
      secondaryPosition: secondary,
    };
    await persistProfile(data);
    setVisible(false);
  };

  const renderPositions = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => (
    <View style={styles.positionGrid}>
      {positions.map((pos) => (
        <TouchableOpacity
          key={pos}
          style={[
            styles.positionItem,
            value === pos && styles.selectedPosition,
          ]}
          onPress={() => setValue(pos)}
        >
          <Text style={styles.positionText}>{pos}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.title}>Welcome! Tell us about you</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#888"
            value={location}
            onChangeText={setLocation}
          />
          <Text style={styles.sectionTitle}>Primary Position</Text>
          {renderPositions(primary, setPrimary)}
          <Text style={styles.sectionTitle}>Secondary Position</Text>
          {renderPositions(secondary, setSecondary)}
          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0f0f23',
    color: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },
  positionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  positionItem: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: 4,
  },
  selectedPosition: {
    backgroundColor: '#4CAF50',
  },
  positionText: {
    color: '#fff',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
