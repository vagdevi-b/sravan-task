import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoTimesheetViewComponent } from './pmo-timesheet-view.component';

describe('PmoTimesheetViewComponent', () => {
  let component: PmoTimesheetViewComponent;
  let fixture: ComponentFixture<PmoTimesheetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmoTimesheetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmoTimesheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
