/*
 * Model odpovídá JSONu budoucího API:
 * - id je string UUID (na backendu Guid)
 * - datum je ISO string (JSON.parse ani API nevrací objekty Date)
 */
export type PowerState = 'on' | 'off';
export type TempUnit = 'c' | 'f';
export type HistoryEventType = 'power' | 'temperature' | 'unit';

export interface SaunaHistoryRecord {
  id: string;
  timestamp: string;
  type: HistoryEventType;
  message: string;
  power: PowerState;
  targetTemp: number;
  tempUnit: TempUnit;
}

export interface Sauna {
  id: string;
  name: string;
  createdAt: string;
  power?: PowerState;
  tempUnit?: TempUnit;
  targetTemp?: number;
  history?: SaunaHistoryRecord[];
}

export type NewSauna = Omit<Sauna, 'id' | 'createdAt'>;
