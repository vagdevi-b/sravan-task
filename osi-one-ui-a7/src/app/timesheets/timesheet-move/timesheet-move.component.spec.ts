import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetMoveComponent } from './timesheet-move.component';

describe('TimesheetMoveComponent', () => {
  let component: TimesheetMoveComponent;
  let fixture: ComponentFixture<TimesheetMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
