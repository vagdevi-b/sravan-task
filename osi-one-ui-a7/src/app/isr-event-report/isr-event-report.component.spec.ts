import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsrEventReportComponent } from './isr-event-report.component';

describe('IsrEventReportComponent', () => {
  let component: IsrEventReportComponent;
  let fixture: ComponentFixture<IsrEventReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsrEventReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsrEventReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
