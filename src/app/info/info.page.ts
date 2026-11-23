import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonIcon, IonItem, IonLabel, IonList,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logoGithub, timeOutline, thermometerOutline, flashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-info',
  templateUrl: 'info.page.html',
  styleUrls: ['info.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonIcon, IonItem, IonLabel, IonList,
  ],
})
export class InfoPage {
  constructor() {
    addIcons({ logoGithub, timeOutline, thermometerOutline, flashOutline });
  }
}
