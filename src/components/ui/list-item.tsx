import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { ThemedView } from '../themed-view';
import { ThemedText } from '../themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
}

export function ListItem({
  title,
  subtitle,
  value,
  icon,
  destructive,
  style,
  ...props
}: ListItemProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.item, style]}
      activeOpacity={0.6}
      {...props}>
      {icon && <ThemedView style={styles.icon}>{icon}</ThemedView>}
      <ThemedView style={styles.content}>
        <ThemedText
          style={[styles.title, destructive && { color: theme.destructive }]}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        )}
      </ThemedView>
      {value && (
        <ThemedText type="small" themeColor="textSecondary">
          {value}
        </ThemedText>
      )}
      {props.onPress && (
        <ThemedText themeColor="textSecondary" style={styles.chevron}>
          ›
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    borderRadius: Radius.md,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
});