import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoTimesheetHistoryComponent } from './pmo-timesheet-history.component';

describe('PmoTimesheetHistoryComponent', () => {
  let component: PmoTimesheetHistoryComponent;
  let fixture: ComponentFixture<PmoTimesheetHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmoTimesheetHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmoTimesheetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
