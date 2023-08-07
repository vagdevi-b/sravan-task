import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingExchangeRatesComponent } from './missing-exchange-rates.component';

describe('MissingExchangeRatesComponent', () => {
  let component: MissingExchangeRatesComponent;
  let fixture: ComponentFixture<MissingExchangeRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingExchangeRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingExchangeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
