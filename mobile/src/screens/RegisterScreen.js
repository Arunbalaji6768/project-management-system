import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(form);
    } catch (error) {
      Alert.alert('Registration failed', error.response?.data?.message || 'Unable to create an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput
        value={form.fullName}
        onChangeText={(text) => setForm((current) => ({ ...current, fullName: text }))}
        placeholder="Full name"
        style={styles.input}
      />
      <TextInput
        value={form.email}
        onChangeText={(text) => setForm((current) => ({ ...current, email: text }))}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={form.password}
        onChangeText={(text) => setForm((current) => ({ ...current, password: text }))}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Register'}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryText}>Already have an account?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 28, fontWeight: '700', color: '#f8fafc', marginBottom: 18 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    color: '#f8fafc',
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondaryText: { color: '#93c5fd', textAlign: 'center', marginTop: 18 },
});
