import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlutilizationComponent } from './report-plutilization.component';

describe('ReportPlutilizationComponent', () => {
  let component: ReportPlutilizationComponent;
  let fixture: ComponentFixture<ReportPlutilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPlutilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPlutilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
