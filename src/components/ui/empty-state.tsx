import { StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedView } from '../themed-view';
import { ThemedText } from '../themed-text';
import { Spacing } from '@/constants/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  loading?: boolean;
}

export function EmptyState({ icon, title, message, loading }: EmptyStateProps) {
  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {icon && <ThemedText style={styles.icon}>{icon}</ThemedText>}
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          {message && (
            <ThemedText themeColor="textSecondary" style={styles.message}>
              {message}
            </ThemedText>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
    gap: Spacing.two,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
});