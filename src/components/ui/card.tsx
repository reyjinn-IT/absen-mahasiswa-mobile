import { StyleSheet, type ViewProps } from 'react-native';
import { ThemedView } from '../themed-view';
import { Radius } from '@/constants/theme';

export function Card({ style, children, ...props }: ViewProps) {
  return (
    <ThemedView type="cardBackground" style={[styles.card, style]} {...props}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});