import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEmployeeTableComponent } from './report-employee-table.component';

describe('ReportEmployeeTableComponent', () => {
  let component: ReportEmployeeTableComponent;
  let fixture: ComponentFixture<ReportEmployeeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEmployeeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
