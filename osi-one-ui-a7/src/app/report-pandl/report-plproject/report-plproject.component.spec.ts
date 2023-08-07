import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlprojectComponent } from './report-plproject.component';

describe('ReportPlprojectComponent', () => {
  let component: ReportPlprojectComponent;
  let fixture: ComponentFixture<ReportPlprojectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPlprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPlprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
