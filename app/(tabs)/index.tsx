// app\(tabs)\index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AvailabilityToggle from '../../components/AvailabilityToggle';

interface Squad {
  id: string;
  name: string;
  memberCount: number;
  role: 'Manager' | 'Assistant Manager' | 'Captain' | 'Player';
  nextGame?: string;
}

export default function SquadsScreen() {
  const router = useRouter();

  const [squads, setSquads] = useState<Squad[]>([
    {
      id: '1',
      name: 'Sunday League FC',
      memberCount: 16,
      role: 'Manager',
      nextGame: 'Tomorrow 3PM',
    },
    {
      id: '2',
      name: 'Park Pickup Games',
      memberCount: 8,
      role: 'Player',
      nextGame: 'Friday 6PM',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  const setSquadAvailability = (squadId: string, value: boolean) => {
    setAvailability((prev) => ({ ...prev, [squadId]: value }));
  };

  const handleCreateSquad = () => {
    if (newSquadName.trim()) {
      const newSquad: Squad = {
        id: Date.now().toString(),
        name: newSquadName.trim(),
        memberCount: 1,
        role: 'Manager',
      };
      setSquads([newSquad, ...squads]);
      setNewSquadName('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter a squad name');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manager': return '#4CAF50';
      case 'Assistant Manager': return '#FF9800';
      case 'Captain': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Your Squads</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {squads.length === 0 ? (
          // Empty State
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={80} color="#666" />
            <Text style={styles.emptyTitle}>No squads yet</Text>
            <Text style={styles.emptyDescription}>
              Create or join your first squad to start organizing games
            </Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createFirstButtonText}>Create Squad</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Squad List
          <View style={styles.squadList}>
            {squads.map((squad) => (
              <TouchableOpacity
                key={squad.id}
                style={styles.squadCard}
                onPress={() => {
                  router.push({
                    pathname: '/squad/[id]',  // Remove /index
                    params: { id: squad.id }
                  });
                }}
              >
                <View style={styles.squadHeader}>
                  <Text style={styles.squadName}>{squad.name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(squad.role) }]}>
                    <Text style={styles.roleText}>{squad.role.charAt(0)}</Text>
                  </View>
                </View>
                
                <View style={styles.squadInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="people" size={16} color="#888" />
                    <Text style={styles.infoText}>{squad.memberCount} members</Text>
                  </View>
                  
                  {squad.nextGame && (
                    <View style={styles.infoRow}>
                      <Ionicons name="time" size={16} color="#4CAF50" />
                      <Text style={[styles.infoText, { color: '#4CAF50' }]}>
                        Next: {squad.nextGame}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.squadActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <View style={styles.availabilityWrapper}>
                    <AvailabilityToggle
                      available={!!availability[squad.id]}
                      onToggle={(value) => setSquadAvailability(squad.id, value)}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="search" size={24} color="#4CAF50" />
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Find Local Games</Text>
              <Text style={styles.quickActionDescription}>Join pickup games near you</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="qr-code" size={24} color="#4CAF50" />
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Join with Code</Text>
              <Text style={styles.quickActionDescription}>Enter a squad invite code</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Create Squad Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Squad</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Enter squad name"
              placeholderTextColor="#888"
              value={newSquadName}
              onChangeText={setNewSquadName}
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewSquadName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateSquad}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0f0f23',
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  createFirstButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  squadList: {
    paddingBottom: 20,
  },
  squadCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  squadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  squadName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  roleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  squadInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 8,
  },
  squadActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  availabilityWrapper: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActions: {
    marginTop: 20,
    paddingBottom: 40,
  },
  quickActionsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  quickActionText: {
    flex: 1,
    marginLeft: 16,
  },
  quickActionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionDescription: {
    color: '#888',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 320,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: '#0f0f23',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 8,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  squadItem: {
    backgroundColor: '#1a2235',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  squadText: {
    color: '#fff',
    fontSize: 16,
  },
});