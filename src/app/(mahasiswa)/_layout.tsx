import { Tabs } from 'expo-router';
import { Platform, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/hooks/use-theme';
import { useRoleGuard } from '@/hooks/use-role-guard';
import { ThemedView } from '@/components/themed-view';

export default function MahasiswaLayout() {
  const theme = useTheme();
  const { isAllowed } = useRoleGuard('mahasiswa');

  if (!isAllowed) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.separator,
          borderTopWidth: 0.5,
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: -0.2,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <SymbolView name="square.grid.2x2.fill" size={24} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kelas"
        options={{
          title: 'Kelas',
          tabBarIcon: ({ color }) => (
            <SymbolView name="rectangle.3.group.fill" size={24} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="absen"
        options={{
          title: 'Absen',
          tabBarIcon: ({ color }) => (
            <SymbolView name="checkmark.circle.fill" size={24} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color }) => (
            <SymbolView name="clock.fill" size={24} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <SymbolView name="person.circle.fill" size={24} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}