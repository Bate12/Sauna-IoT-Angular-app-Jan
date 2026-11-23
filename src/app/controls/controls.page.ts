import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { power } from 'ionicons/icons';
import { SaunaPickerComponent } from '../sauna-picker/sauna-picker.component';
import { SaunaService } from '../services/sauna.service';

@Component({
  selector: 'app-controls',
  templateUrl: 'controls.page.html',
  styleUrls: ['controls.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonText, SaunaPickerComponent],
})
export class ControlsPage {
  readonly saunaService = inject(SaunaService);

  readonly sauna = this.saunaService.selected;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  /** Aktuální čas, tiká každou sekundu → přepočítá timer. */
  private readonly now = signal(Date.now());

  /** Jak dlouho je sauna zapnutá, ve formátu HH:MM:SS. */
  readonly elapsed = computed(() => {
    const turnedOnAt = this.sauna()?.turnedOnAt;
    if (!turnedOnAt) return '00:00:00';
    const seconds = Math.max(0, Math.floor((this.now() - Date.parse(turnedOnAt)) / 1000));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
  });

  constructor() {
    addIcons({ power });
    const timer = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  async toggle(): Promise<void> {
    const sauna = this.sauna();
    if (!sauna || this.busy()) return;

    this.busy.set(true);
    this.error.set(null);
    try {
      await this.saunaService.setPower(sauna.id, !sauna.isOn);
      this.now.set(Date.now());
    } catch (e) {
      console.error(e);
      this.error.set(sauna.isOn ? 'Failed to turn the sauna off.' : 'Failed to turn the sauna on.');
    } finally {
      this.busy.set(false);
    }
  }
}
