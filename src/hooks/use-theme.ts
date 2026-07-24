import { Colors } from '@/constants/theme';
import { useThemePreference } from '@/contexts/ThemeContext';

export function useTheme() {
  const { colorScheme } = useThemePreference();
  return Colors[colorScheme];
}