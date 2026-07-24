import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { mahasiswaService, type MahasiswaDashboard } from '@/services/mahasiswa';
import { useAuth } from '@/contexts/AuthContext';

export default function MahasiswaDashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<MahasiswaDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await mahasiswaService.getDashboard();
      setData(res);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusLabel = data?.absensi_hari_ini?.status;
  const statusColor =
    statusLabel === 'hadir' ? '#34C759' :
    statusLabel === 'izin' ? '#FF9500' :
    statusLabel === 'sakit' ? '#FF2D55' : '#8E8E93';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}>
          <ThemedView style={styles.header}>
            <ThemedText type="small" themeColor="textSecondary">Mahasiswa</ThemedText>
            <ThemedText type="title" style={styles.greeting}>
              Halo, {user?.name ?? 'Mahasiswa'}
            </ThemedText>
          </ThemedView>

          <Card style={styles.todayCard}>
            <ThemedText type="small" themeColor="textSecondary">Absensi Hari Ini</ThemedText>
            {loading ? (
              <ThemedText style={styles.todayStatus}>Memuat...</ThemedText>
            ) : statusLabel ? (
              <ThemedView style={styles.todayRow}>
                <ThemedText style={[styles.todayStatus, { color: statusColor }]}>
                  {statusLabel.toUpperCase()}
                </ThemedText>
                {data?.absensi_hari_ini?.waktu && (
                  <ThemedText type="small" themeColor="textSecondary">
                    {data.absensi_hari_ini.waktu}
                  </ThemedText>
                )}
              </ThemedView>
            ) : (
              <ThemedText style={styles.todayStatus}>Belum absen</ThemedText>
            )}
          </Card>

          <ThemedView style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <ThemedText type="small" themeColor="textSecondary">Total Kelas</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#007AFF' }]}>
                {loading ? '-' : data?.total_kelas ?? 0}
              </ThemedText>
            </Card>
            <Card style={styles.statCard}>
              <ThemedText type="small" themeColor="textSecondary">Hadir</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#34C759' }]}>
                {loading ? '-' : data?.total_hadir ?? 0}
              </ThemedText>
            </Card>
            <Card style={styles.statCard}>
              <ThemedText type="small" themeColor="textSecondary">Izin</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#FF9500' }]}>
                {loading ? '-' : data?.total_izin ?? 0}
              </ThemedText>
            </Card>
            <Card style={styles.statCard}>
              <ThemedText type="small" themeColor="textSecondary">Alpha</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#FF2D55' }]}>
                {loading ? '-' : data?.total_alpha ?? 0}
              </ThemedText>
            </Card>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.four, paddingBottom: Spacing.six * 2 },
  header: { gap: 4 },
  greeting: { fontSize: 32, lineHeight: 40 },
  todayCard: { gap: Spacing.one },
  todayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  todayStatus: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  statCard: { width: '47%', flexGrow: 1, gap: Spacing.one },
  statValue: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
});