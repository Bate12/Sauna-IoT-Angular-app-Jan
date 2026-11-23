import { Injectable, inject, signal } from '@angular/core';
import { DataStorage } from '../data/data-storage';
import { Sauna } from '../data/sauna.model';
import { SaunaRepository } from '../data/sauna.repository';

/** Vybraná sauna je nastavení zařízení – zůstává lokální i ve verzi s backendem. */
const SELECTED_KEY = 'selected_sauna_id';
const DEFAULT_SAUNA_NAME = 'Moje sauna';

/** Stav saun pro UI. Data čte a ukládá výhradně přes SaunaRepository. */
@Injectable({ providedIn: 'root' })
export class SaunaService {
  private readonly repo = inject(SaunaRepository);
  private readonly storage = inject(DataStorage);

  readonly saunas = signal<Sauna[]>([]);
  readonly selectedId = signal<string | null>(null);

  constructor() {
    this.load().catch((e) => console.error('Nepodařilo se načíst sauny.', e));
  }

  private async load(): Promise<void> {
    let saunas = await this.repo.getAll();
    if (saunas.length === 0) {
      saunas = [await this.repo.create({ name: DEFAULT_SAUNA_NAME })];
    }
    this.saunas.set(saunas);

    const savedId = await this.storage.get<string>(SELECTED_KEY);
    this.selectedId.set(saunas.some((s) => s.id === savedId) ? savedId : saunas[0].id);
  }

  async select(id: string): Promise<void> {
    this.selectedId.set(id);
    await this.storage.set(SELECTED_KEY, id);
  }

  /** Vytvoří novou saunu a rovnou ji vybere. Při chybě vyhodí výjimku (zobrazí ji formulář). */
  async add(name: string): Promise<Sauna> {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Název sauny je povinný.');
    if (this.exists(trimmed)) throw new Error('Sauna s tímto názvem už existuje.');

    const sauna = await this.repo.create({ name: trimmed });
    this.saunas.update((list) => [...list, sauna]);
    await this.select(sauna.id);
    return sauna;
  }

  exists(name: string): boolean {
    const n = name.trim().toLowerCase();
    return this.saunas().some((s) => s.name.toLowerCase() === n);
  }
}
