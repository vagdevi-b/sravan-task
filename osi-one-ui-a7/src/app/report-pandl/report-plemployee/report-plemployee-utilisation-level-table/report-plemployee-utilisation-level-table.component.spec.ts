import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlemployeeUtilisationLevelTableComponent } from './report-plemployee-utilisation-level-table.component';

describe('ReportPlemployeeUtilisationLevelTableComponent', () => {
  let component: ReportPlemployeeUtilisationLevelTableComponent;
  let fixture: ComponentFixture<ReportPlemployeeUtilisationLevelTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPlemployeeUtilisationLevelTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPlemployeeUtilisationLevelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
