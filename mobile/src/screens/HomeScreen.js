import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.fullName || 'User'}</Text>

      <Pressable style={styles.card} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.cardTitle}>Dashboard</Text>
        <Text style={styles.cardText}>Overview of your projects and tasks</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate('Projects')}>
        <Text style={styles.cardTitle}>Projects</Text>
        <Text style={styles.cardText}>View and manage your projects</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate('Tasks')}>
        <Text style={styles.cardTitle}>Tasks</Text>
        <Text style={styles.cardText}>Create, edit, and track tasks</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 24 },
  welcome: { fontSize: 28, fontWeight: '700', color: '#f8fafc', marginBottom: 18 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: { fontSize: 20, color: '#f8fafc', fontWeight: '700' },
  cardText: { color: '#cbd5e1', marginTop: 4 },
  logoutButton: { marginTop: 28, backgroundColor: '#dc2626', borderRadius: 10, padding: 14, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '700' },
});
