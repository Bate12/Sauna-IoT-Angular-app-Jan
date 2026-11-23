import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { SaunaPickerComponent } from '../sauna-picker/sauna-picker.component';

@Component({
  selector: 'app-historie',
  templateUrl: 'historie.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, SaunaPickerComponent],
})
export class HistoriePage {}
