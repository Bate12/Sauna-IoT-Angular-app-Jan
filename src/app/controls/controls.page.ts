import { Component, computed, inject } from '@angular/core';
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
import { PowerState, TempUnit } from '../data/sauna.model';
import { SaunaPickerComponent } from '../sauna-picker/sauna-picker.component';
import { SaunaService } from '../services/sauna.service';

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

  readonly powerState = computed<PowerState>(
    () => this.saunaService.selected()?.power ?? 'off',
  );

  readonly tempUnit = computed<TempUnit>(
    () => this.saunaService.selected()?.tempUnit ?? 'c',
  );

  readonly minTemp = computed(() =>
    this.tempUnit() === 'c' ? DEFAULT_MIN_C : this.celsiusToFahrenheit(DEFAULT_MIN_C),
  );

  readonly maxTemp = computed(() =>
    this.tempUnit() === 'c' ? DEFAULT_MAX_C : this.celsiusToFahrenheit(DEFAULT_MAX_C),
  );

  readonly tempValue = computed(() => {
    const sauna = this.saunaService.selected();
    const fallback = this.tempUnit() === 'c' ? 40 : 104;
    return this.clampTemp(sauna?.targetTemp ?? fallback);
  });

  async onPowerChange(event: SegmentCustomEvent): Promise<void> {
    const sauna = this.saunaService.selected();
    const value = event.detail.value;
    if (!sauna || (value !== 'on' && value !== 'off') || value === this.powerState()) {
      return;
    }

    await this.saunaService.updateControls(sauna.id, { power: value });
  }

  async onUnitChange(event: SelectCustomEvent): Promise<void> {
    const sauna = this.saunaService.selected();
    const nextUnit = event.detail.value;
    if (!sauna || (nextUnit !== 'c' && nextUnit !== 'f') || nextUnit === this.tempUnit()) {
      return;
    }

    const converted =
      nextUnit === 'f'
        ? this.celsiusToFahrenheit(this.tempValue())
        : this.fahrenheitToCelsius(this.tempValue());

    const min = nextUnit === 'c' ? DEFAULT_MIN_C : this.celsiusToFahrenheit(DEFAULT_MIN_C);
    const max = nextUnit === 'c' ? DEFAULT_MAX_C : this.celsiusToFahrenheit(DEFAULT_MAX_C);
    const clamped = Math.min(max, Math.max(min, Math.round(converted)));

    await this.saunaService.updateControls(sauna.id, {
      tempUnit: nextUnit,
      targetTemp: clamped,
    });
  }

  async onTempChange(event: RangeCustomEvent): Promise<void> {
    const sauna = this.saunaService.selected();
    const value = event.detail.value;
    if (!sauna || typeof value !== 'number') return;

    const clamped = this.clampTemp(value);
    if (clamped !== this.tempValue()) {
      await this.saunaService.updateControls(sauna.id, { targetTemp: clamped });
    }
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
}