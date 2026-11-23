import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { DataStorage } from './data-storage';

/**
 * DataStorage nad Capacitor Preferences.
 * - v prohlížeči ukládá do localStorage
 * - na telefonu (Android/iOS) do nativního úložiště
 */
@Injectable()
export class PreferencesDataStorage extends DataStorage {
  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }
}
