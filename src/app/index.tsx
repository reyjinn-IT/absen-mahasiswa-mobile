import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing } from '@/constants/theme';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const role = user?.role;
    if (role === 'admin') {
      router.replace('/(admin)/dashboard');
    } else if (role === 'dosen') {
      router.replace('/(dosen)/dashboard');
    } else if (role === 'mahasiswa') {
      router.replace('/(mahasiswa)/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" />
      <ThemedText themeColor="textSecondary" style={styles.text}>
        Memuat...
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  text: {
    fontSize: 16,
  },
});