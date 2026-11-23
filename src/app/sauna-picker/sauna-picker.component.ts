import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, checkmark, chevronDown, createOutline, trashOutline } from 'ionicons/icons';
import { Sauna } from '../data/sauna.model';
import { SaunaService } from '../services/sauna.service';

/** Výběr sauny v headeru: název sauny → bottom sheet se seznamem, přidáním a úpravou. */
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
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonNote,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class SaunaPickerComponent {
  readonly saunaService = inject(SaunaService);
  private readonly alertCtrl = inject(AlertController);

  /** Bottom sheet se seznamem saun. */
  readonly isSheetOpen = signal(false);

  /** Formulář: editing = null → přidání nové sauny, jinak úprava této sauny. */
  readonly isFormOpen = signal(false);
  readonly editing = signal<Sauna | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  name = '';

  constructor() {
    addIcons({ add, checkmark, chevronDown, createOutline, trashOutline });
  }

  get isDuplicate(): boolean {
    return !!this.name.trim() && this.saunaService.exists(this.name, this.editing()?.id);
  }

  get canSave(): boolean {
    const trimmed = this.name.trim();
    const unchanged = trimmed === this.editing()?.name;
    return !!trimmed && !unchanged && !this.isDuplicate && !this.saving();
  }

  openSheet(): void {
    this.isSheetOpen.set(true);
  }

  async choose(id: string): Promise<void> {
    this.isSheetOpen.set(false);
    await this.saunaService.select(id);
  }

  openAdd(): void {
    this.openForm(null);
  }

  openEdit(sauna: Sauna): void {
    this.openForm(sauna);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  async save(): Promise<void> {
    if (!this.canSave) return;
    const editing = this.editing();
    await this.run(() =>
      editing ? this.saunaService.rename(editing.id, this.name) : this.saunaService.add(this.name),
    );
  }

  async confirmDelete(): Promise<void> {
    const sauna = this.editing();
    if (!sauna || !this.saunaService.canDelete()) return;

    const alert = await this.alertCtrl.create({
      header: 'Delete sauna?',
      message: `"${sauna.name}" will be permanently deleted.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.run(() => this.saunaService.remove(sauna.id));
          },
        },
      ],
    });
    await alert.present();
  }

  private openForm(sauna: Sauna | null): void {
    this.editing.set(sauna);
    this.name = sauna?.name ?? '';
    this.formError.set(null);
    // Sheet zavřeme, aby se nepřekrývaly dva modaly.
    this.isSheetOpen.set(false);
    this.isFormOpen.set(true);
  }

  /** Spustí akci formuláře; při úspěchu formulář zavře, při chybě zobrazí hlášku. */
  private async run(action: () => Promise<unknown>): Promise<void> {
    this.saving.set(true);
    this.formError.set(null);
    try {
      await action();
      this.closeForm();
    } catch (e) {
      this.formError.set(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      this.saving.set(false);
    }
  }
}
