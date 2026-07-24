import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { getStoredValue, setStoredValue } from '@/utils/preferences-storage';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedColorScheme = 'light' | 'dark';

const THEME_PREFERENCE_KEY = 'abseen_theme_preference';

interface ThemeContextValue {
    preference: ThemePreference;
    colorScheme: ResolvedColorScheme;
    setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isThemePreference(value: string | null): value is ThemePreference {
    return value === 'light' || value === 'dark' || value === 'system';
}

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
    const systemScheme = useSystemColorScheme();
    const [preference, setPreferenceState] = useState<ThemePreference>('system');

    useEffect(() => {
        (async () => {
        const stored = await getStoredValue(THEME_PREFERENCE_KEY);
        if (isThemePreference(stored)) {
            setPreferenceState(stored);
        }
        })();
    }, []);

    const setPreference = useCallback((next: ThemePreference) => {
        setPreferenceState(next);
        void setStoredValue(THEME_PREFERENCE_KEY, next);
    }, []);

    const colorScheme: ResolvedColorScheme =
        preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

    return (
        <ThemeContext.Provider value={{ preference, colorScheme, setPreference }}>
        {children}
        </ThemeContext.Provider>
    );
}

export function useThemePreference(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
    }
    return context;
}