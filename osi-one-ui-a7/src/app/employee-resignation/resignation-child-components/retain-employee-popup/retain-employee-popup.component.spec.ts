import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetainEmployeePopupComponent } from './retain-employee-popup.component';

describe('RetainEmployeePopupComponent', () => {
  let component: RetainEmployeePopupComponent;
  let fixture: ComponentFixture<RetainEmployeePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetainEmployeePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetainEmployeePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
