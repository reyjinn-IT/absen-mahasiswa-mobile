import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { adminService, type DashboardStats } from '@/services/admin';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.total_users, color: '#007AFF' },
        { label: 'Mahasiswa', value: stats.total_mahasiswa, color: '#34C759' },
        { label: 'Dosen', value: stats.total_dosen, color: '#FF9500' },
        { label: 'Matakuliah', value: stats.total_matakuliah, color: '#AF52DE' },
        { label: 'Kelas', value: stats.total_kelas, color: '#FF2D55' },
        { label: 'Absensi Hari Ini', value: stats.total_absensi_hari_ini, color: '#5AC8FA' },
      ]
    : [];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <ThemedView style={styles.header}>
            <ThemedText type="small" themeColor="textSecondary">
              Admin Panel
            </ThemedText>
            <ThemedText type="title" style={styles.greeting}>
              Selamat datang,{'\n'}
              {user?.name ?? 'Admin'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statsGrid}>
            {statCards.map((card, i) => (
              <Card key={i} style={styles.statCard}>
                <ThemedText type="small" themeColor="textSecondary">
                  {card.label}
                </ThemedText>
                <ThemedText style={[styles.statValue, { color: card.color }]}>
                  {loading ? '-' : card.value}
                </ThemedText>
              </Card>
            ))}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.four,
    gap: Spacing.four,
    paddingBottom: Spacing.six * 2,
  },
  header: {
    gap: 4,
  },
  greeting: {
    fontSize: 32,
    lineHeight: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
});