import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { DataStorage } from '../data/data-storage';
import { PreferencesDataStorage } from '../data/preferences-data-storage';
import { SaunaRepository } from '../data/sauna.repository';
import { LocalSaunaRepository } from '../data/local-sauna.repository';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DataStorage, useClass: PreferencesDataStorage },
        { provide: SaunaRepository, useClass: LocalSaunaRepository },
      ],
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
