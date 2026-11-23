import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsPage } from './controls.page';
import { DataStorage } from '../data/data-storage';
import { PreferencesDataStorage } from '../data/preferences-data-storage';
import { SaunaRepository } from '../data/sauna.repository';
import { LocalSaunaRepository } from '../data/local-sauna.repository';

describe('ControlsPage', () => {
  let component: ControlsPage;
  let fixture: ComponentFixture<ControlsPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DataStorage, useClass: PreferencesDataStorage },
        { provide: SaunaRepository, useClass: LocalSaunaRepository },
      ],
    });
    fixture = TestBed.createComponent(ControlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
