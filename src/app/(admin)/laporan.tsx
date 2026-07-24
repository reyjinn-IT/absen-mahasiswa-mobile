import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { adminService } from '@/services/admin';

export default function AdminLaporanScreen() {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [kelasId, setKelasId] = useState('');

  const fetchLaporan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getLaporanAbsensi({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        kelas_id: kelasId || undefined,
      });
      setData(Array.isArray(res) ? res : []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, kelasId]);

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.pageTitle}>Laporan Absensi</ThemedText>

          <ThemedView style={styles.filterSection}>
            <Input
              label="Tanggal Mulai"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
            />
            <Input
              label="Tanggal Akhir"
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
            />
            <Input
              label="ID Kelas"
              value={kelasId}
              onChangeText={setKelasId}
              placeholder="Opsional"
              keyboardType="numeric"
            />
            <Button title="Terapkan Filter" onPress={fetchLaporan} loading={loading} variant="secondary" />
          </ThemedView>

          {loading ? (
            <EmptyState title="Memuat..." loading />
          ) : data.length === 0 ? (
            <EmptyState
              title="Belum ada data"
              message="Pilih filter tanggal untuk melihat laporan"
              icon="📊"
            />
          ) : (
            <ThemedView style={styles.list}>
              {data.map((item: unknown, i: number) => {
                const record = item as Record<string, unknown>;
                return (
                  <Card key={i}>
                    <ThemedText style={styles.cardTitle}>
                      {String(record.mahasiswa_name ?? 'Mahasiswa')}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {String(record.tanggal ?? '-')} · {String(record.status ?? '-')}
                    </ThemedText>
                  </Card>
                );
              })}
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
  filterSection: { gap: Spacing.three },
  list: { gap: Spacing.two },
  cardTitle: { fontSize: 16, fontWeight: '600' },
});