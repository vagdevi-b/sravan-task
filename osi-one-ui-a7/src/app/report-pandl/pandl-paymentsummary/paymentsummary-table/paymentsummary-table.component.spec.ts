import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsummaryTableComponent } from './paymentsummary-table.component';

describe('PaymentsummaryTableComponent', () => {
  let component: PaymentsummaryTableComponent;
  let fixture: ComponentFixture<PaymentsummaryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsummaryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
