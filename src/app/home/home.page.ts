import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { TestComponentaComponent } from '../test-componenta/test-componenta.component';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonAlert, IonButton,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonIcon, IonSegment, IonSegmentButton, IonItem, IonLabel, IonSelect,
  IonSelectOption, IonRange, IonList // Přidáno sem z @ionic/angular
} from '@ionic/angular';
import { addIcons } from 'ionicons';
// Přidány chybějící importy pro ikony ve statistikách
import { logoGithub, timeOutline, thermometerOutline, flashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonAlert, IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonIcon, IonSegment, IonSegmentButton, IonItem, IonLabel, IonSelect,
    IonSelectOption, IonRange, IonList, TestComponentaComponent
  ],
})
export class HomePage implements OnInit {
  alertButtons = ['Action'];

  // State variables with default values
  powerState: string = 'off';
  tempUnit: string = 'c';
  tempValue: number = 40;

  constructor() {
    // Nyní se ikony správně načtou bez chyb
    addIcons({ logoGithub, timeOutline, thermometerOutline, flashOutline });
  }

  // Load state when the app starts
  ngOnInit() {
    const savedPower = localStorage.getItem('sauna_power');
    const savedUnit = localStorage.getItem('sauna_unit');
    const savedTemp = localStorage.getItem('sauna_temp');

    if (savedPower) this.powerState = savedPower;
    if (savedUnit) this.tempUnit = savedUnit;
    if (savedTemp) this.tempValue = parseInt(savedTemp, 10);
  }

  // Save state whenever a value changes
  saveState() {
    localStorage.setItem('sauna_power', this.powerState);
    localStorage.setItem('sauna_unit', this.tempUnit);
    localStorage.setItem('sauna_temp', this.tempValue.toString());
    
    // In the future, this is where you will send the WebSocket message:
    // this.websocketService.sendMessage({ power: this.powerState, temp: this.tempValue });
  }
}