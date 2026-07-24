import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
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
import { mahasiswaService, type MahasiswaKelas } from '@/services/mahasiswa';

export default function AbsenScreen() {
  const [kelas, setKelas] = useState<MahasiswaKelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<MahasiswaKelas | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchKelas = useCallback(async () => {
    try {
      const res = await mahasiswaService.getKelasMahasiswa();
      setKelas(res);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchKelas(); }, [fetchKelas]);

  const openAbsen = (k: MahasiswaKelas) => {
    setSelectedKelas(k);
    setLatitude('');
    setLongitude('');
    setModalVisible(true);
  };

  const handleAbsen = async () => {
    if (!selectedKelas) return;
    setSubmitting(true);
    try {
      const result = await mahasiswaService.absenMasuk({
        kelas_id: selectedKelas.id,
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
      });
      Alert.alert('Berhasil', `Absen berhasil pada ${(result as Record<string, string>).waktu ?? ''}`);
      setModalVisible(false);
    } catch (e: unknown) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Gagal melakukan absen');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchKelas(); }} />}>
          <ThemedView style={styles.headerRow}>
            <ThemedText type="title" style={styles.pageTitle}>Absen Masuk</ThemedText>
            <TouchableOpacity onPress={() => { /* navigate to izin */ }}>
              <ThemedText themeColor="tint" type="smallBold">+ Izin</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Pilih kelas untuk melakukan absen
          </ThemedText>

          {loading ? (
            <EmptyState title="Memuat..." loading />
          ) : kelas.length === 0 ? (
            <EmptyState title="Belum ada kelas" message="Anda belum terdaftar di kelas apapun" />
          ) : (
            <ThemedView style={styles.list}>
              {kelas.map((k) => (
                <Card key={k.id} style={styles.card}>
                  <ThemedView style={styles.cardContent}>
                    <ThemedView>
                      <ThemedText style={styles.cardTitle}>{k.nama}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {k.matakuliah.nama} · {k.dosen.name}
                      </ThemedText>
                    </ThemedView>
                    <Button
                      title="Absen"
                      size="sm"
                      onPress={() => openAbsen(k)}
                    />
                  </ThemedView>
                </Card>
              ))}
            </ThemedView>
          )}
        </ScrollView>

        <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <ThemedView style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <ThemedText themeColor="tint">Batal</ThemedText>
                </TouchableOpacity>
                <ThemedText type="subtitle" style={styles.modalTitle}>Absen Masuk</ThemedText>
                <TouchableOpacity onPress={handleAbsen} disabled={submitting}>
                  <ThemedText themeColor="tint" style={{ fontWeight: '600' }}>
                    {submitting ? '...' : 'Kirim'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>

              <ThemedView style={styles.form}>
                <Card>
                  <ThemedText style={styles.selectedKelas}>{selectedKelas?.nama}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {selectedKelas?.matakuliah.nama}
                  </ThemedText>
                </Card>

                <Input
                  label="Latitude"
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="Contoh: -6.2088"
                  keyboardType="decimal-pad"
                />
                <Input
                  label="Longitude"
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="Contoh: 106.8456"
                  keyboardType="decimal-pad"
                />
              </ThemedView>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.four, paddingBottom: Spacing.six * 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 32, lineHeight: 40 },
  subtitle: { fontSize: 15 },
  list: { gap: Spacing.two },
  card: {},
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1 },
  modalScroll: { padding: Spacing.four, gap: Spacing.four },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20 },
  form: { gap: Spacing.three },
  selectedKelas: { fontSize: 18, fontWeight: '600' },
});