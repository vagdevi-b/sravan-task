import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoTimesheetSubmissionComponent } from './pmo-timesheet-submission.component';

describe('PmoTimesheetSubmissionComponent', () => {
  let component: PmoTimesheetSubmissionComponent;
  let fixture: ComponentFixture<PmoTimesheetSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmoTimesheetSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmoTimesheetSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
