import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { SaunaPickerComponent } from '../sauna-picker/sauna-picker.component';

@Component({
  selector: 'app-controls',
  templateUrl: 'controls.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, SaunaPickerComponent],
})
export class ControlsPage {}
