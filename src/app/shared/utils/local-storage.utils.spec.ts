import { getLocalStorage, setLocalStorage } from './local-storage.utils';

const TEST_KEY = 'test-storage-key';

describe('local-storage.utils', () => {
  beforeEach(() => {
    localStorage.removeItem(TEST_KEY);
  });

  describe('getLocalStorage', () => {
    it('should return default when key is missing', () => {
      const result = getLocalStorage(TEST_KEY, 'array', []);
      expect(result).toEqual([]);
    });

    it('should parse array when the key has valid JSON array', () => {
      localStorage.setItem(TEST_KEY, "[1, 2, 3]");
      const result = getLocalStorage<number[]>(TEST_KEY, 'array', []);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return default when value is not a valid array', () => {
      localStorage.setItem(TEST_KEY, "[1, 2], 3");
      const result = getLocalStorage(TEST_KEY, 'array', []);
      expect(result).toEqual([]);
    });

    it('should return default when JSON parse fails', () => {
      localStorage.setItem(TEST_KEY, 'not valid json');
      const result = getLocalStorage(TEST_KEY, 'array', []);
      expect(result).toEqual([]);
    });
  });

  describe('setLocalStorage', () => {
    it('should store string value', () => {
      setLocalStorage(TEST_KEY, 'stored');
      expect(localStorage.getItem(TEST_KEY)).toBe('stored');
    });

    it('should store and retrieve array via getLocalStorage', () => {
      const value = [1, 2, 3];
      setLocalStorage(TEST_KEY, value);
      const result = getLocalStorage<number[]>(TEST_KEY, 'array', []);
      expect(result).toEqual(value);
    });
  });
});
