/**
 * Abstraktní úložiště typu klíč → hodnota.
 * Repository o konkrétní technologii (Preferences, localStorage…) neví nic,
 * pracuje jen s touto třídou. Hodnoty se ukládají jako JSON.
 */
export abstract class DataStorage {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T): Promise<void>;
}
