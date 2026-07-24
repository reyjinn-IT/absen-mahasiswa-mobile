import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemePreferenceProvider, useThemePreference } from '@/contexts/ThemeContext';

function AppShell() {
  const { colorScheme } = useThemePreference();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(dosen)" />
        <Stack.Screen name="(mahasiswa)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemePreferenceProvider>
  );
}