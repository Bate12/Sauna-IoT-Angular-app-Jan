import { Injectable, computed, inject, signal } from '@angular/core';
import { DataStorage } from '../data/data-storage';
import { Sauna, SaunaHistoryRecord } from '../data/sauna.model';
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

/** Aktualizuje stav ovládání sauny a zapíše změnu do její historie přes SaunaRepository. */
  async updateControls(
    id: string,
    changes: Partial<Pick<Sauna, 'power' | 'tempUnit' | 'targetTemp'>>,
  ): Promise<Sauna> {
    const sauna = this.saunas().find((s) => s.id === id);
    if (!sauna) throw new Error('Sauna not found.');

    const nextPower = changes.power ?? sauna.power ?? 'off';
    const nextUnit = changes.tempUnit ?? sauna.tempUnit ?? 'c';
    const nextTemp = changes.targetTemp ?? sauna.targetTemp ?? (nextUnit === 'c' ? 40 : 104);

    const record = this.createHistoryRecord(sauna, {
      power: nextPower,
      tempUnit: nextUnit,
      targetTemp: nextTemp,
    });

    const history = record
      ? [record, ...(sauna.history ?? [])].slice(0, 100)
      : (sauna.history ?? []);

    const updated = await this.repo.update({
      ...sauna,
      ...changes,
      history,
    });

    this.saunas.update((list) => list.map((s) => (s.id === id ? updated : s)));
    return updated;
  }

  /** Vymaže historii vybrané sauny přes SaunaRepository. */
  async clearHistory(id: string): Promise<void> {
    const sauna = this.saunas().find((s) => s.id === id);
    if (!sauna) throw new Error('Sauna not found.');

    const updated = await this.repo.update({ ...sauna, history: [] });
    this.saunas.update((list) => list.map((s) => (s.id === id ? updated : s)));
  }

  private createHistoryRecord(
    previous: Sauna,
    current: { power: 'on' | 'off'; tempUnit: 'c' | 'f'; targetTemp: number },
  ): SaunaHistoryRecord | null {
    const prevPower = previous.power ?? 'off';
    const prevUnit = previous.tempUnit ?? 'c';
    const prevTemp = previous.targetTemp ?? (prevUnit === 'c' ? 40 : 104);
    const unitLabel = current.tempUnit === 'c' ? '°C' : '°F';

    let type: SaunaHistoryRecord['type'] | null = null;
    let message = '';

    if (current.power !== prevPower) {
      type = 'power';
      message = current.power === 'on' ? 'Sauna turned ON' : 'Sauna turned OFF';
    } else if (current.tempUnit !== prevUnit) {
      type = 'unit';
      message = `Unit switched to ${unitLabel} (${current.targetTemp} ${unitLabel})`;
    } else if (current.targetTemp !== prevTemp) {
      type = 'temperature';
      message = `Target temperature set to ${current.targetTemp} ${unitLabel}`;
    }

    if (!type) return null;

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      power: current.power,
      targetTemp: current.targetTemp,
      tempUnit: current.tempUnit,
    };
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
