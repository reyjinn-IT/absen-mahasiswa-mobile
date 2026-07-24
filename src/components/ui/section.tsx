import { StyleSheet, type ViewProps } from 'react-native';
import { ThemedView } from '../themed-view';
import { ThemedText } from '../themed-text';
import { Spacing } from '@/constants/theme';

interface SectionProps extends ViewProps {
  title?: string;
  subtitle?: string;
}

export function Section({ title, subtitle, children, style, ...props }: SectionProps) {
  return (
    <ThemedView style={[styles.container, style]} {...props}>
      {title && (
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText type="small" themeColor="textSecondary">
              {subtitle}
            </ThemedText>
          )}
        </ThemedView>
      )}
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
});