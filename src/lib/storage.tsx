import { Platform } from 'react-native';
import { createMMKV, MMKV } from 'react-native-mmkv';

// Web fallback storage (using localStorage)
const webStorage = {
  getString: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      console.error('Failed to get item from web storage');
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.error('Failed to set item in web storage');
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('Failed to remove item from web storage');
    }
  },
};

// Lazy initialization to prevent crashes on web or when native module isn't available
let storageInstance: MMKV | typeof webStorage | null = null;

function getStorage() {
  if (storageInstance) return storageInstance;

  try {
    // Only try to use MMKV on native platforms
    if (Platform.OS !== 'web') {
      storageInstance = createMMKV();
      return storageInstance;
    } else {
      storageInstance = webStorage;
      return storageInstance;
    }
  } catch {
    console.error('Failed to initialize MMKV');
    storageInstance = webStorage;
    return storageInstance;
  }
}

export const storage = getStorage();

export function getItem<T>(key: string): T {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.remove(key);
}
