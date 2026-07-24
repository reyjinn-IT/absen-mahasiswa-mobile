import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { ThemedText } from '../themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: ViewStyle;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  size = 'md',
  containerStyle,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const bgColors: Record<string, string> = {
    primary: theme.tint,
    secondary: theme.backgroundElement,
    destructive: theme.destructive,
    ghost: 'transparent',
  };

  const textColors: Record<string, string> = {
    primary: '#FFFFFF',
    secondary: theme.text,
    destructive: '#FFFFFF',
    ghost: theme.tint,
  };

  const paddings: Record<string, number> = {
    sm: 10,
    md: 14,
    lg: 18,
  };

  const fontSizes: Record<string, number> = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bgColors[variant],
          paddingVertical: paddings[size],
          opacity: disabled ? 0.5 : 1,
        },
        containerStyle,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <ThemedText
          style={[
            styles.text,
            {
              color: textColors[variant],
              fontSize: fontSizes[size],
            },
          ]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  text: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});