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
    try {
      await persistProfile(data);
    } catch (err) {
      console.warn('Failed to persist profile', err);
    } finally {
      setVisible(false);
    }
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