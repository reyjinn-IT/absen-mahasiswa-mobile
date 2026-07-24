import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
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
import { Spacing } from '@/constants/theme';
import { mahasiswaService } from '@/services/mahasiswa';

export default function IzinScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [kelasId, setKelasId] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [keterangan, setKeterangan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!kelasId || !tanggal || !keterangan) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }
    setSubmitting(true);
    try {
      await mahasiswaService.ajukanIzin({
        kelas_id: parseInt(kelasId, 10),
        tanggal,
        keterangan,
      });
      Alert.alert('Berhasil', 'Pengajuan izin berhasil dikirim');
      setModalVisible(false);
      setKelasId('');
      setKeterangan('');
    } catch (e: unknown) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Gagal mengajukan izin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.pageTitle}>Pengajuan Izin</ThemedText>

          <Card style={styles.infoCard}>
            <ThemedText style={styles.infoTitle}>📝 Izin Tidak Masuk</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.infoText}>
              Ajukan izin jika Anda tidak dapat hadir di kelas. Sertakan alasan yang jelas.
            </ThemedText>
          </Card>

          <ThemedView style={styles.form}>
            <Input
              label="ID Kelas"
              value={kelasId}
              onChangeText={setKelasId}
              placeholder="Masukkan ID kelas"
              keyboardType="numeric"
            />
            <Input
              label="Tanggal"
              value={tanggal}
              onChangeText={setTanggal}
              placeholder="YYYY-MM-DD"
            />
            <Input
              label="Keterangan"
              value={keterangan}
              onChangeText={setKeterangan}
              placeholder="Alasan tidak dapat hadir"
              multiline
              numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: 'top' }}
            />
            <Button
              title="Ajukan Izin"
              onPress={handleSubmit}
              loading={submitting}
              size="lg"
            />
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
  pageTitle: { fontSize: 32, lineHeight: 40 },
  infoCard: { gap: Spacing.one },
  infoTitle: { fontSize: 18, fontWeight: '600' },
  infoText: { lineHeight: 20 },
  form: { gap: Spacing.three },
});