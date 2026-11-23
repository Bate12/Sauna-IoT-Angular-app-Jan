/*
 * Model odpovídá JSONu budoucího API:
 * - id je string UUID (na backendu Guid)
 * - datum je ISO string (JSON.parse ani API nevrací objekty Date)
 */
export interface Sauna {
  id: string;
  name: string;
  createdAt: string;
  /** Je sauna zapnutá? */
  isOn: boolean;
  /** Kdy byla sauna zapnuta (ISO string); null, když je vypnutá. Z toho se počítá timer. */
  turnedOnAt: string | null;
}

/** Data pro vytvoření sauny – zbytek (id, datum, stav) doplní repository. */
export type NewSauna = Pick<Sauna, 'name'>;
