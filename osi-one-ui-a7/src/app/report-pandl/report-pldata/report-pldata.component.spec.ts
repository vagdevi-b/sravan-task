import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPldataComponent } from './report-pldata.component';

describe('ReportPldataComponent', () => {
  let component: ReportPldataComponent;
  let fixture: ComponentFixture<ReportPldataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPldataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPldataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
