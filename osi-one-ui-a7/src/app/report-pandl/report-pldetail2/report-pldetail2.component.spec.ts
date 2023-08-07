import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPldetail2Component } from './report-pldetail2.component';

describe('ReportPldetail2Component', () => {
  let component: ReportPldetail2Component;
  let fixture: ComponentFixture<ReportPldetail2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPldetail2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPldetail2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
