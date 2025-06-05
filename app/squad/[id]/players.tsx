import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Player {
  id: string;
  name: string;
}

export default function PlayersScreen() {
  const { id } = useLocalSearchParams();

  const players: Player[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alex Johnson' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Players in Squad {id}</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <Text style={styles.playerName}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08111c',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  playerItem: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
  },
});
