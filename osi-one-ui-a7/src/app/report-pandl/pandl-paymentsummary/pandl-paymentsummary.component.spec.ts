import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PandlPaymentsummaryComponent } from './pandl-paymentsummary.component';

describe('PandlPaymentsummaryComponent', () => {
  let component: PandlPaymentsummaryComponent;
  let fixture: ComponentFixture<PandlPaymentsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PandlPaymentsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PandlPaymentsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
