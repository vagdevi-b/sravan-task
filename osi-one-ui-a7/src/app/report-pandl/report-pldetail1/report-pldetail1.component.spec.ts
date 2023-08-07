import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPldetail1Component } from './report-pldetail1.component';

describe('ReportPldetail1Component', () => {
  let component: ReportPldetail1Component;
  let fixture: ComponentFixture<ReportPldetail1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPldetail1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPldetail1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
