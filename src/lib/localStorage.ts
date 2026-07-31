const PREFIX = "mt_";

export const loadCollection = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    /* ignore */
  }
  return [];
};

export const saveCollection = <T>(key: string, items: T[]): void => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(items));
  } catch {
    /* ignore */
  }
};

export const uid = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const nowISO = (): string => new Date().toISOString();
