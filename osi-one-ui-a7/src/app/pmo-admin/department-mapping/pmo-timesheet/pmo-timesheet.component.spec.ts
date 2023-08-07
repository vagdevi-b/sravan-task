import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoTimesheetComponent } from './pmo-timesheet.component';

describe('PmoTimesheetComponent', () => {
  let component: PmoTimesheetComponent;
  let fixture: ComponentFixture<PmoTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmoTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmoTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
