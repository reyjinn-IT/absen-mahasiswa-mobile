import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { dosenService, type DosenDashboard } from '@/services/dosen';
import { useAuth } from '@/contexts/AuthContext';

export default function DosenDashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<DosenDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await dosenService.getDashboard();
      setData(res);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}>
          <ThemedView style={styles.header}>
            <ThemedText type="small" themeColor="textSecondary">Dosen Panel</ThemedText>
            <ThemedText type="title" style={styles.greeting}>
              Halo, {user?.name ?? 'Dosen'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <ThemedText type="small" themeColor="textSecondary">Total Kelas</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#007AFF' }]}>
                {loading ? '-' : data?.total_kelas ?? 0}
              </ThemedText>
            </Card>
            <Card style={styles.statCard}>
              <ThemedText type="small" themeColor="textSecondary">Total Mahasiswa</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#34C759' }]}>
                {loading ? '-' : data?.total_mahasiswa ?? 0}
              </ThemedText>
            </Card>
            <Card style={styles.statCard}>
              <ThemedText type="small" themeColor="textSecondary">Absensi Hari Ini</ThemedText>
              <ThemedText style={[styles.statValue, { color: '#FF9500' }]}>
                {loading ? '-' : data?.absensi_hari_ini ?? 0}
              </ThemedText>
            </Card>
          </ThemedView>

          {data?.kelas_list && data.kelas_list.length > 0 && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Kelas Saya</ThemedText>
              {data.kelas_list.map((k) => (
                <Card key={k.id} style={styles.kelasCard}>
                  <ThemedText style={styles.kelasName}>{k.nama}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {k.matakuliah.nama} ({k.matakuliah.kode}) · {k.mahasiswa_count} mahasiswa
                  </ThemedText>
                </Card>
              ))}
            </ThemedView>
          )}
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  statCard: { width: '47%', flexGrow: 1, gap: Spacing.one },
  statValue: { fontSize: 32, fontWeight: '700', lineHeight: 38 },
  section: { gap: Spacing.three },
  sectionTitle: { fontSize: 22, lineHeight: 28 },
  kelasCard: { gap: 4 },
  kelasName: { fontSize: 16, fontWeight: '600' },
});