import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlmyviewComponent } from './report-plmyview.component';

describe('ReportPlmyviewComponent', () => {
  let component: ReportPlmyviewComponent;
  let fixture: ComponentFixture<ReportPlmyviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPlmyviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPlmyviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
