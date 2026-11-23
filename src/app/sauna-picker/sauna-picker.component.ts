import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SaunaService } from '../services/sauna.service';

@Component({
  selector: 'app-sauna-picker',
  templateUrl: 'sauna-picker.component.html',
  styleUrls: ['sauna-picker.component.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class SaunaPickerComponent {
  readonly saunaService = inject(SaunaService);

  readonly isModalOpen = signal(false);
  readonly saving = signal(false);
  readonly createError = signal<string | null>(null);
  newName = '';

  constructor() {
    addIcons({ add });
  }

  get isDuplicate(): boolean {
    return !!this.newName.trim() && this.saunaService.exists(this.newName);
  }

  get canCreate(): boolean {
    return !!this.newName.trim() && !this.isDuplicate && !this.saving();
  }

  onSelect(id: string): void {
    this.saunaService.select(id);
  }

  openModal(): void {
    this.newName = '';
    this.createError.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  async create(): Promise<void> {
    if (!this.canCreate) return;
    this.saving.set(true);
    this.createError.set(null);
    try {
      await this.saunaService.add(this.newName);
      this.closeModal();
    } catch (e) {
      this.createError.set(e instanceof Error ? e.message : 'Saunu se nepodařilo vytvořit.');
    } finally {
      this.saving.set(false);
    }
  }
}
