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
    return (await this.storage.get<Sauna[]>(SAUNAS_KEY)) ?? [];
  }

  async create(data: NewSauna): Promise<Sauna> {
    const sauna: Sauna = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data };
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

  private saveAll(saunas: Sauna[]): Promise<void> {
    return this.storage.set(SAUNAS_KEY, saunas);
  }
}
