import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { mahasiswaService, type MahasiswaKelas } from '@/services/mahasiswa';

export default function MahasiswaKelasScreen() {
  const [data, setData] = useState<MahasiswaKelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await mahasiswaService.getKelasMahasiswa();
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
          <ThemedText type="title" style={styles.pageTitle}>Kelas Saya</ThemedText>

          {loading ? (
            <EmptyState title="Memuat..." loading />
          ) : data.length === 0 ? (
            <EmptyState title="Belum ada kelas" message="Anda belum terdaftar di kelas apapun" icon="📚" />
          ) : (
            <ThemedView style={styles.list}>
              {data.map((k) => (
                <Card key={k.id} style={styles.card}>
                  <ThemedText style={styles.cardTitle}>{k.nama}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {k.matakuliah.nama} ({k.matakuliah.kode})
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Dosen: {k.dosen.name}
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
  pageTitle: { fontSize: 32, lineHeight: 40 },
  list: { gap: Spacing.two },
  card: { gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
});