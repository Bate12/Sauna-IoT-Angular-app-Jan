/*
 * Model odpovídá JSONu budoucího API:
 * - id je string UUID (na backendu Guid)
 * - datum je ISO string (JSON.parse ani API nevrací objekty Date)
 */
export interface Sauna {
  id: string;
  name: string;
  createdAt: string;
}

export type NewSauna = Omit<Sauna, 'id' | 'createdAt'>;
