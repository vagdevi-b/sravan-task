import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPandlComponent } from './report-pandl.component';

describe('ReportPandlComponent', () => {
  let component: ReportPandlComponent;
  let fixture: ComponentFixture<ReportPandlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPandlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPandlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
