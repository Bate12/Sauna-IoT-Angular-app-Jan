import { Component, computed, OnInit, signal } from '@angular/core';
import { IonButton } from '@ionic/angular';

const NAMES = ["Jan", "René", "Martin", "MalerM"]

@Component({
  selector: 'app-test-componenta',
  templateUrl: './test-componenta.component.html',
  styleUrls: ['./test-componenta.component.scss'],
  imports: [IonButton],
})
export class TestComponentaComponent implements OnInit {
  count = signal(10);

  incrementCount() {
    this.count.update((count) => count + 1);
  }
  constructor() {}

  ngOnInit() {}
}
