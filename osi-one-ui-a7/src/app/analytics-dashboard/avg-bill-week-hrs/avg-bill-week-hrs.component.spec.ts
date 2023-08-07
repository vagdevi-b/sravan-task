import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgBillWeekHrsComponent } from './avg-bill-week-hrs.component';

describe('AvgBillWeekHrsComponent', () => {
  let component: AvgBillWeekHrsComponent;
  let fixture: ComponentFixture<AvgBillWeekHrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgBillWeekHrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgBillWeekHrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
