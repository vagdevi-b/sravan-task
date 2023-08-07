import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSavedComponent } from './report-saved.component';

describe('ReportSavedComponent', () => {
  let component: ReportSavedComponent;
  let fixture: ComponentFixture<ReportSavedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSavedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
