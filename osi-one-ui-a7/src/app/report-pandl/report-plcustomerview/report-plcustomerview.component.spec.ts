import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlcustomerviewComponent } from './report-plcustomerview.component';

describe('ReportPlcustomerviewComponent', () => {
  let component: ReportPlcustomerviewComponent;
  let fixture: ComponentFixture<ReportPlcustomerviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPlcustomerviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPlcustomerviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
