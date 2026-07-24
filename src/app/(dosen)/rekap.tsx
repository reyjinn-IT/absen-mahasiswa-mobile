import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { dosenService, type RekapAbsensi } from '@/services/dosen';

export default function DosenRekapScreen() {
  const theme = useTheme();
  const [kelasId, setKelasId] = useState('');
  const [data, setData] = useState<RekapAbsensi[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchRekap = useCallback(async () => {
    if (!kelasId) return;
    setLoading(true);
    try {
      const res = await dosenService.getRekapAbsensi(parseInt(kelasId, 10));
      setData(res);
      setFetched(true);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [kelasId]);

  const getPercentageColor = (pct: number) => {
    if (pct >= 80) return '#34C759';
    if (pct >= 60) return '#FF9500';
    return '#FF2D55';
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.pageTitle}>Rekap Absensi</ThemedText>

          <ThemedView style={styles.filterRow}>
            <Input
              label="ID Kelas"
              value={kelasId}
              onChangeText={setKelasId}
              placeholder="Masukkan ID kelas"
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
            <Button title="Lihat" onPress={fetchRekap} loading={loading} containerStyle={styles.filterBtn} />
          </ThemedView>

          {!fetched ? (
            <EmptyState title="Cari rekap absensi" message="Masukkan ID kelas untuk melihat rekap" icon="📊" />
          ) : data.length === 0 ? (
            <EmptyState title="Tidak ada data" message="Belum ada data absensi untuk kelas ini" />
          ) : (
            <ThemedView style={styles.list}>
              {data.map((r, i) => (
                <Card key={i}>
                  <ThemedView style={styles.rekapHeader}>
                    <ThemedView>
                      <ThemedText style={styles.rekapName}>{r.mahasiswa.name}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">{r.mahasiswa.nim}</ThemedText>
                    </ThemedView>
                    <ThemedText
                      style={[styles.percentage, { color: getPercentageColor(r.persentase) }]}>
                      {r.persentase}%
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.rekapDetail}>
                    <ThemedView style={styles.rekapItem}>
                      <ThemedText type="small" themeColor="textSecondary">Hadir</ThemedText>
                      <ThemedText style={styles.rekapValue}>{r.total_hadir}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.rekapItem}>
                      <ThemedText type="small" themeColor="textSecondary">Izin</ThemedText>
                      <ThemedText style={styles.rekapValue}>{r.total_izin}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.rekapItem}>
                      <ThemedText type="small" themeColor="textSecondary">Sakit</ThemedText>
                      <ThemedText style={styles.rekapValue}>{r.total_sakit}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.rekapItem}>
                      <ThemedText type="small" themeColor="textSecondary">Alpha</ThemedText>
                      <ThemedText style={styles.rekapValue}>{r.total_alpha}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={styles.progressBar}>
                    <ThemedView
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(r.persentase, 100)}%`,
                          backgroundColor: getPercentageColor(r.persentase),
                        },
                      ]}
                    />
                  </ThemedView>
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
  filterRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-end' },
  filterBtn: { marginBottom: 0 },
  list: { gap: Spacing.two },
  rekapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rekapName: { fontSize: 16, fontWeight: '600' },
  percentage: { fontSize: 28, fontWeight: '700' },
  rekapDetail: { flexDirection: 'row', gap: Spacing.three, marginTop: Spacing.three },
  rekapItem: { flex: 1, alignItems: 'center', gap: 2 },
  rekapValue: { fontSize: 18, fontWeight: '700' },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginTop: Spacing.three,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
});