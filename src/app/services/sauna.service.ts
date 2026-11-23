import { Injectable, computed, inject, signal } from '@angular/core';
import { DataStorage } from '../data/data-storage';
import { Sauna } from '../data/sauna.model';
import { SaunaRepository } from '../data/sauna.repository';

/** Vybraná sauna je nastavení zařízení – zůstává lokální i ve verzi s backendem. */
const SELECTED_KEY = 'selected_sauna_id';
const DEFAULT_SAUNA_NAME = 'My sauna';

/** Stav saun pro UI. Data čte a ukládá výhradně přes SaunaRepository. */
@Injectable({ providedIn: 'root' })
export class SaunaService {
  private readonly repo = inject(SaunaRepository);
  private readonly storage = inject(DataStorage);

  readonly saunas = signal<Sauna[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly selected = computed(() => this.saunas().find((s) => s.id === this.selectedId()));
  /** Vždy musí existovat alespoň jedna sauna. */
  readonly canDelete = computed(() => this.saunas().length > 1);

  constructor() {
    this.load().catch((e) => console.error('Failed to load saunas.', e));
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
    const trimmed = this.validateName(name);
    const sauna = await this.repo.create({ name: trimmed });
    this.saunas.update((list) => [...list, sauna]);
    await this.select(sauna.id);
    return sauna;
  }

  /** Přejmenuje saunu. */
  async rename(id: string, name: string): Promise<Sauna> {
    const sauna = this.saunas().find((s) => s.id === id);
    if (!sauna) throw new Error('Sauna not found.');

    const updated = await this.repo.update({ ...sauna, name: this.validateName(name, id) });
    this.saunas.update((list) => list.map((s) => (s.id === id ? updated : s)));
    return updated;
  }

  /** Smaže saunu. Poslední saunu smazat nejde; pokud byla vybraná, vybere se jiná. */
  async remove(id: string): Promise<void> {
    if (!this.canDelete()) throw new Error('At least one sauna must exist.');

    await this.repo.delete(id);
    const rest = this.saunas().filter((s) => s.id !== id);
    this.saunas.set(rest);
    if (this.selectedId() === id) await this.select(rest[0].id);
  }

  /** Je název už použitý? `exceptId` = sauna, kterou právě přejmenováváme. */
  exists(name: string, exceptId?: string): boolean {
    const n = name.trim().toLowerCase();
    return this.saunas().some((s) => s.id !== exceptId && s.name.toLowerCase() === n);
  }

  private validateName(name: string, exceptId?: string): string {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Sauna name is required.');
    if (this.exists(trimmed, exceptId)) throw new Error('A sauna with this name already exists.');
    return trimmed;
  }
}
