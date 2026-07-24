import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Spacing } from '@/constants/theme';
import { adminService, type Kelas } from '@/services/admin';

export default function AdminKelasScreen() {
  const [data, setData] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Kelas | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formMatakuliahId, setFormMatakuliahId] = useState('');
  const [formDosenId, setFormDosenId] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await adminService.getKelas();
      setData(res);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setFormNama('');
    setFormMatakuliahId('');
    setFormDosenId('');
    setModalVisible(true);
  };

  const openEdit = (k: Kelas) => {
    setEditing(k);
    setFormNama(k.nama);
    setFormMatakuliahId(String(k.matakuliah_id));
    setFormDosenId(String(k.dosen_id));
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formNama) return;
    setSaving(true);
    try {
      const payload = {
        nama: formNama,
        matakuliah_id: parseInt(formMatakuliahId, 10),
        dosen_id: parseInt(formDosenId, 10),
      };
      if (editing) {
        await adminService.updateKelas(editing.id, payload);
      } else {
        await adminService.createKelas(payload);
      }
      setModalVisible(false);
      fetchData();
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number, nama: string) => {
    Alert.alert('Hapus Kelas', `Yakin hapus "${nama}"?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => {
        try { await adminService.deleteKelas(id); fetchData(); }
        catch (e) { Alert.alert('Error', e instanceof Error ? e.message : 'Gagal'); }
      }},
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}>
          <ThemedView style={styles.headerRow}>
            <ThemedText type="title" style={styles.pageTitle}>Kelas</ThemedText>
            <Button title="+ Tambah" size="sm" onPress={openCreate} />
          </ThemedView>

          {loading ? (
            <EmptyState title="Memuat..." loading />
          ) : data.length === 0 ? (
            <EmptyState title="Belum ada kelas" message="Tambahkan kelas baru" />
          ) : (
            <ThemedView style={styles.list}>
              {data.map((k) => (
                <Card key={k.id} style={styles.card}>
                  <ThemedView style={styles.cardContent}>
                    <ThemedView>
                      <ThemedText style={styles.cardTitle}>{k.nama}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {k.matakuliah?.nama ?? 'Matakuliah'} · {k.mahasiswa_count ?? 0} mahasiswa
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.cardActions}>
                      <TouchableOpacity onPress={() => openEdit(k)}>
                        <ThemedText themeColor="tint" type="smallBold">Edit</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(k.id, k.nama)}>
                        <ThemedText themeColor="destructive" type="smallBold">Hapus</ThemedText>
                      </TouchableOpacity>
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
                <ThemedText type="subtitle" style={styles.modalTitle}>
                  {editing ? 'Edit' : 'Tambah'} Kelas
                </ThemedText>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                  <ThemedText themeColor="tint" style={{ fontWeight: '600' }}>{saving ? '...' : 'Simpan'}</ThemedText>
                </TouchableOpacity>
              </ThemedView>
              <ThemedView style={styles.form}>
                <Input label="Nama Kelas" value={formNama} onChangeText={setFormNama} placeholder="Contoh: A / B" />
                <Input label="ID Matakuliah" value={formMatakuliahId} onChangeText={setFormMatakuliahId} placeholder="ID matakuliah" keyboardType="numeric" />
                <Input label="ID Dosen" value={formDosenId} onChangeText={setFormDosenId} placeholder="ID dosen" keyboardType="numeric" />
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
  list: { gap: Spacing.two },
  card: {},
  cardContent: { gap: Spacing.three },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: Spacing.four },
  modalContainer: { flex: 1 },
  modalScroll: { padding: Spacing.four, gap: Spacing.four },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20 },
  form: { gap: Spacing.three },
});