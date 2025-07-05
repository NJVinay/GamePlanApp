import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentDetailsScreen({ route }) {
  const { student } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Student Details</Text>
      <Text style={styles.detail}>Name: {student.name}</Text>
      <Text style={styles.detail}>Task: {student.task}</Text>
      <Text style={styles.detail}>Progress: {student.progress}%</Text>
      <Text style={styles.detail}>Attendance: {student.attendance}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f8fc' },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  detail: { fontSize: 16, marginBottom: 10 },
});