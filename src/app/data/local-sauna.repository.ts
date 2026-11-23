import { Injectable, inject } from '@angular/core';
import { DataStorage } from './data-storage';
import { NewSauna, Sauna } from './sauna.model';
import { SaunaRepository } from './sauna.repository';

const SAUNAS_KEY = 'saunas';

/** Verze 1: sauny se ukládají lokálně v zařízení přes DataStorage. */
@Injectable()
export class LocalSaunaRepository extends SaunaRepository {
  private readonly storage = inject(DataStorage);

  async getAll(): Promise<Sauna[]> {
    const saunas = (await this.storage.get<Sauna[]>(SAUNAS_KEY)) ?? [];
    // Sauny uložené před přidáním zapínání nemají stav → doplníme výchozí (vypnuto).
    return saunas.map((s) => ({ ...s, isOn: s.isOn ?? false, turnedOnAt: s.turnedOnAt ?? null }));
  }

  async create(data: NewSauna): Promise<Sauna> {
    const sauna: Sauna = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isOn: false,
      turnedOnAt: null,
      ...data,
    };
    await this.saveAll([...(await this.getAll()), sauna]);
    return sauna;
  }

  async update(sauna: Sauna): Promise<Sauna> {
    await this.saveAll((await this.getAll()).map((s) => (s.id === sauna.id ? sauna : s)));
    return sauna;
  }

  async delete(id: string): Promise<void> {
    await this.saveAll((await this.getAll()).filter((s) => s.id !== id));
  }

  turnOn(id: string): Promise<Sauna> {
    return this.setPower(id, true);
  }

  turnOff(id: string): Promise<Sauna> {
    return this.setPower(id, false);
  }

  private async setPower(id: string, isOn: boolean): Promise<Sauna> {
    const sauna = (await this.getAll()).find((s) => s.id === id);
    if (!sauna) throw new Error('Sauna not found.');
    if (sauna.isOn === isOn) return sauna; // už je v požadovaném stavu, čas zapnutí nepřepisujeme

    return this.update({ ...sauna, isOn, turnedOnAt: isOn ? new Date().toISOString() : null });
  }

  private saveAll(saunas: Sauna[]): Promise<void> {
    return this.storage.set(SAUNAS_KEY, saunas);
  }
}
