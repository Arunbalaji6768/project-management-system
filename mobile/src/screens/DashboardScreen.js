import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function DashboardScreen() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/dashboard');
        setSummary(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#60a5fa" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard</Text>
      {summary ? (
        <View style={styles.grid}>
          <View style={styles.card}><Text style={styles.label}>Total projects</Text><Text style={styles.value}>{summary.totalProjects}</Text></View>
          <View style={styles.card}><Text style={styles.label}>Total tasks</Text><Text style={styles.value}>{summary.totalTasks}</Text></View>
          <View style={styles.card}><Text style={styles.label}>Completed</Text><Text style={styles.value}>{summary.completedTasks}</Text></View>
          <View style={styles.card}><Text style={styles.label}>Pending</Text><Text style={styles.value}>{summary.pendingTasks}</Text></View>
          <View style={styles.card}><Text style={styles.label}>In progress</Text><Text style={styles.value}>{summary.inProgressProjects}</Text></View>
        </View>
      ) : (
        <Text style={styles.empty}>No data available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  centered: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, color: '#f8fafc', fontWeight: '700', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    padding: 18,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  label: { color: '#94a3b8', fontSize: 12 },
  value: { marginTop: 8, color: '#f8fafc', fontSize: 28, fontWeight: '700' },
  empty: { color: '#cbd5e1' },
});
