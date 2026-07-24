import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useState } from 'react';
import { ThemedView } from '../themed-view';
import { ThemedText } from '../themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, style, ...props }: InputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <ThemedView
        type="backgroundElement"
        style={[
          styles.inputWrapper,
          isFocused && { borderColor: theme.tint },
          error && { borderColor: theme.destructive },
        ]}>
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            style,
          ]}
          placeholderTextColor={theme.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </ThemedView>
      {error && (
        <ThemedText type="small" themeColor="destructive" style={styles.error}>
          {error}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    marginTop: 2,
  },
});