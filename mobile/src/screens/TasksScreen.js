import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import api from '../services/api';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: '',
    projectId: '',
  });

  const loadData = async () => {
    try {
      const [projectsResponse, tasksResponse] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
      ]);
      setProjects(projectsResponse.data);
      setTasks(tasksResponse.data);
      if (!form.projectId && projectsResponse.data[0]) {
        setForm((current) => ({ ...current, projectId: projectsResponse.data[0].id }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!form.projectId || !form.name) {
        Alert.alert('Missing data', 'Please select a project and task name.');
        return;
      }

      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, form);
      } else {
        await api.post('/tasks', form);
      }

      setModalVisible(false);
      setEditingTaskId(null);
      setForm({
        name: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: '',
        projectId: projects[0]?.id || '',
      });
      loadData();
    } catch (error) {
      Alert.alert('Task error', error.response?.data?.message || 'Unable to save task.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      loadData();
    } catch (error) {
      Alert.alert('Delete failed', error.response?.data?.message || 'Unable to delete task.');
    }
  };

  const openEdit = (task) => {
    setEditingTaskId(task.id);
    setForm({
      name: task.name,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      projectId: task.projectId,
    });
    setModalVisible(true);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#60a5fa" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Tasks</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tasks.length === 0 ? (
          <Text style={styles.empty}>No tasks found.</Text>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={styles.card}>
              <Text style={styles.name}>{task.name}</Text>
              <Text style={styles.meta}>Project: {task.project?.name || 'Unknown'}</Text>
              <Text style={styles.meta}>Priority: {task.priority}</Text>
              <Text style={styles.meta}>Status: {task.status}</Text>
              <Text style={styles.meta}>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</Text>
              <View style={styles.buttonRow}>
                <Pressable style={styles.smallButton} onPress={() => openEdit(task)}>
                  <Text style={styles.smallButtonText}>Edit</Text>
                </Pressable>
                <Pressable style={[styles.smallButton, styles.deleteButton]} onPress={() => handleDelete(task.id)}>
                  <Text style={styles.smallButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingTaskId ? 'Edit task' : 'Create task'}</Text>

            <TextInput value={form.name} onChangeText={(text) => setForm((current) => ({ ...current, name: text }))} placeholder="Task name" style={styles.input} />
            <TextInput value={form.description} onChangeText={(text) => setForm((current) => ({ ...current, description: text }))} placeholder="Description" multiline style={[styles.input, { height: 90 }]} />
            <TextInput value={form.dueDate} onChangeText={(text) => setForm((current) => ({ ...current, dueDate: text }))} placeholder="Due date (YYYY-MM-DD)" style={styles.input} />

            <View style={styles.selectRow}>
              <Text style={styles.label}>Project</Text>
              <TextInput value={projects.find(project => project.id === form.projectId)?.name || ''} editable={false} style={styles.input} />
            </View>

            <TextInput value={form.priority} onChangeText={(text) => setForm((current) => ({ ...current, priority: text.toUpperCase() }))} placeholder="Priority: LOW / MEDIUM / HIGH" style={styles.input} />
            <TextInput value={form.status} onChangeText={(text) => setForm((current) => ({ ...current, status: text.toUpperCase() }))} placeholder="Status: PENDING / IN_PROGRESS / COMPLETED" style={styles.input} />

            <View style={styles.buttonRow}>
              <Pressable style={styles.smallButton} onPress={handleSubmit}>
                <Text style={styles.smallButtonText}>{editingTaskId ? 'Save' : 'Create'}</Text>
              </Pressable>
              <Pressable style={[styles.smallButton, styles.cancelButton]} onPress={() => { setModalVisible(false); setEditingTaskId(null); }}>
                <Text style={styles.smallButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 8 },
  title: { fontSize: 26, color: '#f8fafc', fontWeight: '700' },
  addButton: { backgroundColor: '#2563eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  addText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  name: { color: '#f8fafc', fontSize: 20, fontWeight: '700' },
  meta: { color: '#cbd5e1', marginTop: 6 },
  buttonRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
  smallButton: { backgroundColor: '#2563eb', borderRadius: 8, padding: 10, flex: 1, alignItems: 'center' },
  deleteButton: { backgroundColor: '#dc2626' },
  cancelButton: { backgroundColor: '#475569' },
  smallButtonText: { color: '#fff', fontWeight: '700' },
  empty: { color: '#cbd5e1' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: '#111827', borderRadius: 18, padding: 18 },
  modalTitle: { color: '#f8fafc', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    color: '#f8fafc',
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  label: { color: '#cbd5e1', marginBottom: 6 },
  selectRow: { marginBottom: 10 },
});
