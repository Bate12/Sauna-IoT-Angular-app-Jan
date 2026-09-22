import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponentaComponent } from './test-componenta.component';

describe('TestComponentaComponent', () => {
  let component: TestComponentaComponent;
  let fixture: ComponentFixture<TestComponentaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
