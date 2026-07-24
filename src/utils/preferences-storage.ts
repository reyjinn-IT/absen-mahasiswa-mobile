import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function getStoredValue(key: string): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
        }
        return await SecureStore.getItemAsync(key);
    } catch {
        return null;
    }
}

export async function setStoredValue(key: string, value: string | null): Promise<void> {
    try {
        if (Platform.OS === 'web') {
        if (typeof localStorage === 'undefined') return;
        if (value) {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
        return;
        }
        if (value) {
        await SecureStore.setItemAsync(key, value);
        } else {
        await SecureStore.deleteItemAsync(key);
        }
    } catch {
        
    }
}