import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#60a5fa" /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Projects</Text>
      {projects.length === 0 ? (
        <Text style={styles.empty}>No projects yet.</Text>
      ) : (
        projects.map((project) => (
          <View key={project.id} style={styles.card}>
            <Text style={styles.name}>{project.name}</Text>
            <Text style={styles.status}>{project.status}</Text>
            <Text style={styles.text}>{project.description || 'No description provided.'}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  title: { fontSize: 26, color: '#f8fafc', fontWeight: '700', marginBottom: 16 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  name: { color: '#f8fafc', fontSize: 20, fontWeight: '700' },
  status: { color: '#93c5fd', marginTop: 6, marginBottom: 8 },
  text: { color: '#cbd5e1' },
  empty: { color: '#cbd5e1' },
});
