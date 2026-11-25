import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  SegmentCustomEvent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  powerOutline,
  swapHorizontalOutline,
  thermometerOutline,
  timeOutline,
  trashOutline,
} from 'ionicons/icons';
import { HistoryEventType, SaunaHistoryRecord } from '../data/sauna.model';
import { SaunaPickerComponent } from '../sauna-picker/sauna-picker.component';
import { SaunaService } from '../services/sauna.service';

type HistoryFilter = 'all' | HistoryEventType;

@Component({
  selector: 'app-historie',
  templateUrl: 'historie.page.html',
  styleUrls: ['historie.page.scss'],
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonNote,
    IonBadge,
    SaunaPickerComponent,
  ],
})
export class HistoriePage {
  readonly saunaService = inject(SaunaService);
  private readonly alertCtrl = inject(AlertController);

  readonly filter = signal<HistoryFilter>('all');

  readonly allRecords = computed<SaunaHistoryRecord[]>(
    () => this.saunaService.selected()?.history ?? [],
  );

  readonly filteredRecords = computed<SaunaHistoryRecord[]>(() => {
    const activeFilter = this.filter();
    const records = this.allRecords();
    return activeFilter === 'all'
      ? records
      : records.filter((record) => record.type === activeFilter);
  });

  constructor() {
    addIcons({
      trashOutline,
      powerOutline,
      thermometerOutline,
      swapHorizontalOutline,
      timeOutline,
    });
  }

  onFilterChange(event: SegmentCustomEvent): void {
    const value = event.detail.value;
    if (value === 'all' || value === 'power' || value === 'temperature' || value === 'unit') {
      this.filter.set(value);
    }
  }

  iconFor(type: HistoryEventType): string {
    switch (type) {
      case 'power':
        return 'power-outline';
      case 'temperature':
        return 'thermometer-outline';
      case 'unit':
        return 'swap-horizontal-outline';
    }
  }

  async confirmClear(): Promise<void> {
    const sauna = this.saunaService.selected();
    if (!sauna || this.allRecords().length === 0) return;

    const alert = await this.alertCtrl.create({
      header: 'Clear history?',
      message: `All history records for "${sauna.name}" will be permanently deleted.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Clear',
          role: 'destructive',
          handler: () => {
            void this.saunaService.clearHistory(sauna.id);
          },
        },
      ],
    });

    await alert.present();
  }
}