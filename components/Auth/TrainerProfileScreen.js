import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function TrainerProfileScreen({ navigation, route }) {
  const { trainerData } = route.params || {};
  const [profileData, setProfileData] = useState(trainerData || null);
  const [loading, setLoading] = useState(!trainerData);

  useEffect(() => {
    if (!profileData) {
      const fetchTrainerData = async () => {
        try {
          const trainerDoc = await getDoc(doc(db, 'trainers', trainerData?.trainerID));
          if (trainerDoc.exists()) {
            setProfileData(trainerDoc.data());
          } else {
            Alert.alert('Error', 'Trainer profile not found.');
            navigation.goBack();
          }
        } catch (error) {
          console.error('Error fetching trainer profile:', error);
          Alert.alert('Error', 'Failed to fetch trainer profile.');
        } finally {
          setLoading(false);
        }
      };

      fetchTrainerData();
    }
  }, [profileData]);

  const getInitialLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#171717', '#444444']} style={styles.gradient}>
      <View style={styles.container}>
        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('SettingsScreen', { profileData })}
        >
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profileInitial}>{getInitialLetter(profileData?.name)}</Text>
          </View>
          <Text style={styles.profileName}>{profileData?.name || 'N/A'}</Text>
          <Text style={styles.profileId}>ID: {profileData?.trainerID || 'N/A'}</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Personal Information</Text>
          <Text style={styles.infoText}>Trainer ID: {profileData?.trainerID || 'N/A'}</Text>
          <Text style={styles.infoText}>Age: {profileData?.age || 'N/A'}</Text>
          <Text style={styles.infoText}>
            Training Address: {profileData?.trainingCenter || 'Kungsmarken'}
          </Text>
          <Text style={styles.infoText}>
            Specialty: {profileData?.sports || 'N/A'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#FFFFFF' },
  settingsButton: { position: 'absolute', top: 20, right: 20, padding: 10 },
  profileHeader: { alignItems: 'center', marginBottom: 20, marginTop: 50 },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DA0037',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: { fontSize: 48, color: '#FFFFFF', fontWeight: 'bold' },
  profileName: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  profileId: { fontSize: 18, color: '#CCCCCC' },
  infoSection: { padding: 15, borderRadius: 10, backgroundColor: '#1E1E1E' },
  infoTitle: { fontSize: 20, color: '#DA0037', marginBottom: 10, fontWeight: 'bold' },
  infoText: { fontSize: 18, color: '#FFFFFF', marginBottom: 5 },
});
