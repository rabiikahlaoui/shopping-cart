export type LocalStorageType = 'array' | 'object' | 'string';

/**
 * Gets a parsed value from localStorage.
 */
export function getLocalStorage<T>(
  key: string,
  type: LocalStorageType,
  defaultValue: T
): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;

    if (type === 'string') {
      return raw as T;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (type === 'array') {
      return (Array.isArray(parsed) ? parsed : defaultValue) as T;
    }
    if (type === 'object') {
      const isObject =
        parsed !== null &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed);
      return (isObject ? parsed : defaultValue) as T;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Sets a value in localStorage with stringify for objects and arrays.
 */
export function setLocalStorage(key: string, value: unknown): void {
  try {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {
    // Ignore storage errors
  }
}
