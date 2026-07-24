import { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/services/api';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      setError('Mohon isi semua field');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Password tidak cocok');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      setSuccess('Pendaftaran berhasil! Silakan masuk.');
      setTimeout(() => router.replace('/login'), 1500);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError('Gagal terhubung ke server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled">
            <ThemedView style={styles.header}>
              <ThemedText type="title" style={styles.appName}>
                ABSEEN
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.tagline}>
                Absensi Mahasiswa
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.form}>
              <ThemedText type="subtitle" style={styles.formTitle}>
                Daftar
              </ThemedText>

              {error ? (
                <ThemedView style={styles.errorBanner}>
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                </ThemedView>
              ) : null}

              {success ? (
                <ThemedView style={styles.successBanner}>
                  <ThemedText style={styles.successText}>{success}</ThemedText>
                </ThemedView>
              ) : null}

              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChangeText={setName}
                autoComplete="name"
              />

              <Input
                label="Email"
                placeholder="nama@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Input
                label="Password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />

              <Input
                label="Konfirmasi Password"
                placeholder="Ulangi password"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry
                autoComplete="new-password"
              />

              <Button
                title="Daftar"
                onPress={handleRegister}
                loading={loading}
                size="lg"
                containerStyle={styles.submitButton}
              />

              <ThemedView style={styles.footer}>
                <ThemedText themeColor="textSecondary">
                  Sudah punya akun?{' '}
                </ThemedText>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <ThemedText
                      type="smallBold"
                      themeColor="tint"
                      style={styles.link}>
                      Masuk
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 15,
  },
  form: {
    gap: Spacing.three,
  },
  formTitle: {
    fontSize: 28,
    marginBottom: Spacing.one,
  },
  errorBanner: {
    backgroundColor: '#FF3B3020',
    borderRadius: 12,
    padding: Spacing.three,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  successBanner: {
    backgroundColor: '#34C75920',
    borderRadius: 12,
    padding: Spacing.three,
  },
  successText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  link: {
    color: '#007AFF',
  },
});