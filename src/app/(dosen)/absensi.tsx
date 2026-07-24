import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { dosenService, type AbsensiRecord } from '@/services/dosen';

export default function DosenAbsensiScreen() {
  const theme = useTheme();
  const { kelasId } = useLocalSearchParams<{ kelasId?: string }>();
  const [data, setData] = useState<AbsensiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tanggal, setTanggal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMahasiswaId, setFormMahasiswaId] = useState('');
  const [formTanggal, setFormTanggal] = useState('');
  const [formStatus, setFormStatus] = useState('hadir');
  const [formKeterangan, setFormKeterangan] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!kelasId) return;
    setLoading(true);
    try {
      const res = await dosenService.getAbsensiKelas(parseInt(kelasId, 10), tanggal || undefined);
      setData(res);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [kelasId, tanggal]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleInputManual = async () => {
    if (!formMahasiswaId || !formTanggal || !kelasId) return;
    setSaving(true);
    try {
      await dosenService.inputAbsensiManual({
        kelas_id: parseInt(kelasId, 10),
        mahasiswa_id: parseInt(formMahasiswaId, 10),
        tanggal: formTanggal,
        status: formStatus,
        keterangan: formKeterangan || undefined,
      });
      setModalVisible(false);
      fetchData();
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Gagal');
    } finally {
      setSaving(false);
    }
  };

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
          <ThemedView style={styles.headerRow}>
            <ThemedText type="title" style={styles.pageTitle}>Absensi Kelas</ThemedText>
            <Button
              title="+ Input Manual"
              size="sm"
              onPress={() => {
                setFormMahasiswaId('');
                setFormTanggal(new Date().toISOString().slice(0, 10));
                setFormStatus('hadir');
                setFormKeterangan('');
                setModalVisible(true);
              }}
            />
          </ThemedView>

          <ThemedView style={styles.filterRow}>
            <Input
              label="Filter Tanggal"
              value={tanggal}
              onChangeText={setTanggal}
              placeholder="YYYY-MM-DD"
              containerStyle={{ flex: 1 }}
            />
          </ThemedView>

          {loading ? (
            <EmptyState title="Memuat..." loading />
          ) : data.length === 0 ? (
            <EmptyState title="Belum ada data absensi" message="Pilih tanggal atau input manual" icon="📋" />
          ) : (
            <ThemedView style={styles.list}>
              {data.map((a) => (
                <Card key={a.id} style={styles.card}>
                  <ThemedView style={styles.cardContent}>
                    <ThemedView style={styles.cardLeft}>
                      <ThemedView style={[styles.avatar, { backgroundColor: statusColor(a.status) + '20' }]}>
                        <ThemedText style={[styles.avatarText, { color: statusColor(a.status) }]}>
                          {a.mahasiswa?.name?.charAt(0) ?? '?'}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView>
                        <ThemedText style={styles.cardTitle}>
                          {a.mahasiswa?.name ?? 'Mahasiswa'}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {a.mahasiswa?.nim ?? '-'} · {a.tanggal}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                    <ThemedView style={[styles.statusBadge, { backgroundColor: statusColor(a.status) + '20' }]}>
                      <ThemedText style={[styles.statusText, { color: statusColor(a.status) }]}>
                        {a.status.toUpperCase()}
                      </ThemedText>
                    </ThemedView>
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
                <ThemedText type="subtitle" style={styles.modalTitle}>Input Absensi Manual</ThemedText>
                <TouchableOpacity onPress={handleInputManual} disabled={saving}>
                  <ThemedText themeColor="tint" style={{ fontWeight: '600' }}>{saving ? '...' : 'Simpan'}</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              <ThemedView style={styles.form}>
                <Input label="ID Mahasiswa" value={formMahasiswaId} onChangeText={setFormMahasiswaId} placeholder="ID mahasiswa" keyboardType="numeric" />
                <Input label="Tanggal" value={formTanggal} onChangeText={setFormTanggal} placeholder="YYYY-MM-DD" />
                <ThemedView style={styles.statusSelector}>
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.label}>STATUS</ThemedText>
                  <ThemedView style={styles.statusRow}>
                    {['hadir', 'izin', 'sakit', 'alpha'].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.statusOption, { backgroundColor: formStatus === s ? theme.tint : theme.backgroundElement }]}
                        onPress={() => setFormStatus(s)}>
                        <ThemedText type="smallBold" style={{ color: formStatus === s ? '#FFF' : theme.text }}>
                          {s}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                </ThemedView>
                <Input label="Keterangan (opsional)" value={formKeterangan} onChangeText={setFormKeterangan} placeholder="Catatan" />
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
  filterRow: { flexDirection: 'row', gap: Spacing.two },
  list: { gap: Spacing.two },
  card: {},
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  modalContainer: { flex: 1 },
  modalScroll: { padding: Spacing.four, gap: Spacing.four },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20 },
  form: { gap: Spacing.three },
  label: { textTransform: 'uppercase', letterSpacing: 0.5 },
  statusSelector: { gap: 6 },
  statusRow: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  statusOption: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, flex: 1, alignItems: 'center', minWidth: 60 },
});