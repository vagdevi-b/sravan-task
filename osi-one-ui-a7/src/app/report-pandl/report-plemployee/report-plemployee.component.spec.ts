import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlemployeeComponent } from './report-plemployee.component';

describe('ReportPlemployeeComponent', () => {
  let component: ReportPlemployeeComponent;
  let fixture: ComponentFixture<ReportPlemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPlemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPlemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
