import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { mahasiswaService, type AbsensiRiwayat } from '@/services/mahasiswa';

export default function RiwayatScreen() {
  const [data, setData] = useState<AbsensiRiwayat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await mahasiswaService.getRiwayatAbsensi();
      setData(res);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusColor = (status: string) => {
    if (status === 'hadir') return '#34C759';
    if (status === 'izin') return '#FF9500';
    if (status === 'sakit') return '#FF2D55';
    return '#8E8E93';
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}>
          <ThemedText type="title" style={styles.pageTitle}>Riwayat Absensi</ThemedText>

          {loading ? (
            <EmptyState title="Memuat..." loading />
          ) : data.length === 0 ? (
            <EmptyState title="Belum ada riwayat" message="Riwayat absensi akan muncul di sini" icon="📋" />
          ) : (
            <ThemedView style={styles.list}>
              {data.map((r) => (
                <Card key={r.id} style={styles.card}>
                  <ThemedView style={styles.cardContent}>
                    <ThemedView style={styles.cardLeft}>
                      <ThemedView style={[styles.dot, { backgroundColor: statusColor(r.status) }]} />
                      <ThemedView>
                        <ThemedText style={styles.cardTitle}>
                          {r.kelas?.matakuliah?.nama ?? 'Matakuliah'}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {r.kelas?.nama ?? '-'} · {r.tanggal}
                        </ThemedText>
                        {r.waktu_absen && (
                          <ThemedText type="small" themeColor="textSecondary">
                            {r.waktu_absen}
                          </ThemedText>
                        )}
                      </ThemedView>
                    </ThemedView>
                    <ThemedView style={[styles.statusBadge, { backgroundColor: statusColor(r.status) + '20' }]}>
                      <ThemedText style={[styles.statusText, { color: statusColor(r.status) }]}>
                        {r.status.toUpperCase()}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  {r.keterangan && (
                    <ThemedText type="small" themeColor="textSecondary" style={styles.keterangan}>
                      📝 {r.keterangan}
                    </ThemedText>
                  )}
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
  pageTitle: { fontSize: 32, lineHeight: 40 },
  list: { gap: Spacing.two },
  card: { gap: Spacing.two },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  keterangan: { marginTop: Spacing.one, fontStyle: 'italic' },
});