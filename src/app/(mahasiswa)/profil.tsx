import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListItem } from '@/components/ui/list-item';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { mahasiswaService } from '@/services/mahasiswa';

export default function ProfilScreen() {
  const { user, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [changing, setChanging] = useState(false);

  const handleGantiPassword = async () => {
    if (!passwordLama || !passwordBaru || !passwordConfirmation) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }
    if (passwordBaru !== passwordConfirmation) {
      Alert.alert('Error', 'Password baru tidak cocok');
      return;
    }
    setChanging(true);
    try {
      await mahasiswaService.gantiPassword({
        password_lama: passwordLama,
        password_baru: passwordBaru,
        password_baru_confirmation: passwordConfirmation,
      });
      Alert.alert('Berhasil', 'Password berhasil diubah');
      setShowPassword(false);
      setPasswordLama('');
      setPasswordBaru('');
      setPasswordConfirmation('');
    } catch (e: unknown) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Gagal mengubah password');
    } finally {
      setChanging(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.pageTitle}>Profil</ThemedText>

          <Card style={styles.profileCard}>
            <ThemedView style={styles.avatarLarge}>
              <ThemedText style={styles.avatarLargeText}>
                {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
              <ThemedText themeColor="textSecondary">{user?.email}</ThemedText>
              <ThemedView style={styles.roleBadge}>
                <ThemedText type="smallBold" style={styles.roleText}>
                  {user?.role?.toUpperCase()}
                </ThemedText>
              </ThemedView>
              {user?.nim && (
                <ThemedText type="small" themeColor="textSecondary">
                  NIM: {user.nim}
                </ThemedText>
              )}
            </ThemedView>
          </Card>

          <ThemedView style={styles.section}>
            <ListItem
              title="Ganti Password"
              subtitle="Ubah password akun Anda"
              onPress={() => setShowPassword(!showPassword)}
            />
          </ThemedView>

          {showPassword && (
            <ThemedView style={styles.form}>
              <Input
                label="Password Lama"
                value={passwordLama}
                onChangeText={setPasswordLama}
                secureTextEntry
                placeholder="Masukkan password lama"
              />
              <Input
                label="Password Baru"
                value={passwordBaru}
                onChangeText={setPasswordBaru}
                secureTextEntry
                placeholder="Minimal 8 karakter"
              />
              <Input
                label="Konfirmasi Password Baru"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                placeholder="Ulangi password baru"
              />
              <Button
                title="Simpan Password"
                onPress={handleGantiPassword}
                loading={changing}
              />
            </ThemedView>
          )}

          <ThemedView style={styles.logoutSection}>
            <Button
              title="Keluar"
              variant="destructive"
              onPress={() => {
                Alert.alert('Keluar', 'Yakin ingin keluar?', [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Keluar', style: 'destructive', onPress: logout },
                ]);
              }}
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
  profileCard: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.four },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#007AFF20', alignItems: 'center', justifyContent: 'center',
  },
  avatarLargeText: { fontSize: 32, fontWeight: '700', color: '#007AFF' },
  profileInfo: { alignItems: 'center', gap: 4 },
  profileName: { fontSize: 22, fontWeight: '600' },
  roleBadge: {
    backgroundColor: '#007AFF20', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, marginTop: 4,
  },
  roleText: { color: '#007AFF', fontSize: 12 },
  section: { gap: 0 },
  form: { gap: Spacing.three },
  logoutSection: { marginTop: Spacing.four },
});