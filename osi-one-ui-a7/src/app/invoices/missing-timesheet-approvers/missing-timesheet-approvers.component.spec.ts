import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingTimesheetApproversComponent } from './missing-timesheet-approvers.component';

describe('MissingTimesheetApproversComponent', () => {
  let component: MissingTimesheetApproversComponent;
  let fixture: ComponentFixture<MissingTimesheetApproversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingTimesheetApproversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingTimesheetApproversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
