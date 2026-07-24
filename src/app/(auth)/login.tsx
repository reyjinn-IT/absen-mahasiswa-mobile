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

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Mohon isi email dan password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const role = user.role;
      if (role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else if (role === 'dosen') {
        router.replace('/(dosen)/dashboard');
      } else {
        router.replace('/(mahasiswa)/dashboard');
      }
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
                Masuk
              </ThemedText>

              {error ? (
                <ThemedView style={styles.errorBanner}>
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                </ThemedView>
              ) : null}

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
                placeholder="Masukkan password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />

              <Button
                title="Masuk"
                onPress={handleLogin}
                loading={loading}
                size="lg"
                containerStyle={styles.submitButton}
              />

              <ThemedView style={styles.footer}>
                <ThemedText themeColor="textSecondary">
                  Belum punya akun?{' '}
                </ThemedText>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <ThemedText
                      type="smallBold"
                      themeColor="tint"
                      style={styles.link}>
                      Daftar
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