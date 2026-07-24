import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useThemePreference, type ThemePreference } from '@/contexts/ThemeContext';
import { Radius, Spacing } from '@/constants/theme';

const OPTIONS: { value: ThemePreference; label: string }[] = [
    { value: 'system', label: 'Sistem' },
    { value: 'light', label: 'Terang' },
    { value: 'dark', label: 'Gelap' },
];

export function ThemeToggle() {
    const theme = useTheme();
    const { preference, setPreference } = useThemePreference();

    return (
        <ThemedView type="backgroundElement" style={[styles.track, { borderColor: theme.separator }]}>
        {OPTIONS.map((option) => {
            const active = option.value === preference;
            return (
            <TouchableOpacity
                key={option.value}
                style={[styles.option, active && { backgroundColor: theme.tint }]}
                onPress={() => setPreference(option.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}>
                <ThemedText
                type="smallBold"
                style={{ color: active ? '#FFFFFF' : theme.text }}>
                {option.label}
                </ThemedText>
            </TouchableOpacity>
            );
        })}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    track: {
        flexDirection: 'row',
        borderRadius: Radius.md,
        borderWidth: 1,
        padding: 4,
        gap: 4,
    },
    option: {
        flex: 1,
        paddingVertical: Spacing.two,
        borderRadius: Radius.sm,
        alignItems: 'center',
    },
});