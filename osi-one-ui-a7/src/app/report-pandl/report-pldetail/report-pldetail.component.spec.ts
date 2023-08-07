import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPldetailComponent } from './report-pldetail.component';

describe('ReportPldetailComponent', () => {
  let component: ReportPldetailComponent;
  let fixture: ComponentFixture<ReportPldetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPldetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
