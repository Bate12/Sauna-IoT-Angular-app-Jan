import { NewSauna, Sauna } from './sauna.model';

/**
 * Kontrakt pro práci se saunami. Komponenty a služby závisí jen na této třídě.
 *  - verze 1: LocalSaunaRepository (lokální úložiště přes DataStorage)
 *  - verze 2: HttpSaunaRepository (backend) – nová třída + změna provideru v main.ts
 */
export abstract class SaunaRepository {
  abstract getAll(): Promise<Sauna[]>;
  abstract create(data: NewSauna): Promise<Sauna>;
  abstract update(sauna: Sauna): Promise<Sauna>;
  abstract delete(id: string): Promise<void>;
}
