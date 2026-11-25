import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  RangeCustomEvent,
  SegmentCustomEvent,
  SelectCustomEvent,
} from '@ionic/angular';
import { SaunaPickerComponent } from '../sauna-picker/sauna-picker.component';
import { SaunaService } from '../services/sauna.service';

type PowerState = 'on' | 'off';
type TempUnit = 'c' | 'f';

interface SaunaControlState {
  power: PowerState;
  unit: TempUnit;
  temp: number;
}

const DEFAULT_MIN_C = 20;
const DEFAULT_MAX_C = 65;

@Component({
  selector: 'app-controls',
  templateUrl: 'controls.page.html',
  styleUrls: ['controls.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonRange,
    SaunaPickerComponent,
  ],
})
export class ControlsPage {
  readonly saunaService = inject(SaunaService);

  readonly powerState = signal<PowerState>('off');
  readonly tempUnit = signal<TempUnit>('c');
  readonly tempValue = signal<number>(40);

  /** Bezpečný spodní limit podle zvolené jednotky (připraveno na limit dle typu sauny). */
  readonly minTemp = computed(() =>
    this.tempUnit() === 'c' ? DEFAULT_MIN_C : this.celsiusToFahrenheit(DEFAULT_MIN_C),
  );

  /** Bezpečný horní limit podle zvolené jednotky (např. Infra 65 °C, Finská 90 °C). */
  readonly maxTemp = computed(() =>
    this.tempUnit() === 'c' ? DEFAULT_MAX_C : this.celsiusToFahrenheit(DEFAULT_MAX_C),
  );

  constructor() {
    // Při každé změně vybrané sauny v <app-sauna-picker> načte její vlastní stav
    effect(() => {
      const selectedSauna = this.saunaService.selected();
      if (selectedSauna) {
        this.loadStateForSauna(selectedSauna.id);
      }
    });
  }

  onPowerChange(event: SegmentCustomEvent): void {
    const value = event.detail.value;
    if (value === 'on' || value === 'off') {
      this.powerState.set(value);
      this.saveState();
    }
  }

  onUnitChange(event: SelectCustomEvent): void {
    const nextUnit = event.detail.value;
    if ((nextUnit !== 'c' && nextUnit !== 'f') || nextUnit === this.tempUnit()) {
      return;
    }

    const converted =
      nextUnit === 'f'
        ? this.celsiusToFahrenheit(this.tempValue())
        : this.fahrenheitToCelsius(this.tempValue());

    this.tempUnit.set(nextUnit);
    this.tempValue.set(this.clampTemp(converted));
    this.saveState();
  }

  onTempChange(event: RangeCustomEvent): void {
    const value = event.detail.value;
    if (typeof value === 'number') {
      this.tempValue.set(this.clampTemp(value));
      this.saveState();
    }
  }

  private loadStateForSauna(saunaId: string): void {
    const raw = localStorage.getItem(this.storageKey(saunaId));
    if (!raw) {
      this.powerState.set('off');
      this.tempUnit.set('c');
      this.tempValue.set(40);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<SaunaControlState>;
      const unit: TempUnit = parsed.unit === 'f' ? 'f' : 'c';
      const power: PowerState = parsed.power === 'on' ? 'on' : 'off';

      this.tempUnit.set(unit);
      this.powerState.set(power);

      const fallbackTemp = unit === 'c' ? 40 : 104;
      const numericTemp = typeof parsed.temp === 'number' && !Number.isNaN(parsed.temp)
        ? parsed.temp
        : fallbackTemp;

      this.tempValue.set(this.clampTemp(numericTemp));
    } catch {
      this.powerState.set('off');
      this.tempUnit.set('c');
      this.tempValue.set(40);
    }
  }

  private saveState(): void {
    const sauna = this.saunaService.selected();
    if (!sauna) return;

    const payload: SaunaControlState = {
      power: this.powerState(),
      unit: this.tempUnit(),
      temp: this.clampTemp(this.tempValue()),
    };

    // Dočasné uložení podle ID sauny – po doplnění SaunaService nahradit REST API / Capacitor Preferences
    localStorage.setItem(this.storageKey(sauna.id), JSON.stringify(payload));
  }

  private clampTemp(value: number): number {
    return Math.min(this.maxTemp(), Math.max(this.minTemp(), Math.round(value)));
  }

  private celsiusToFahrenheit(celsius: number): number {
    return Math.round((celsius * 9) / 5 + 32);
  }

  private fahrenheitToCelsius(fahrenheit: number): number {
    return Math.round(((fahrenheit - 32) * 5) / 9);
  }

  private storageKey(saunaId: string): string {
    return `sauna_controls_${saunaId}`;
  }
}