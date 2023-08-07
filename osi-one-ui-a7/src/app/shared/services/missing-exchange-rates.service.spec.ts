import { TestBed, inject } from '@angular/core/testing';

import { MissingExchangeRatesService } from './missing-exchange-rates.service';

describe('MissingExchangeRatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MissingExchangeRatesService]
    });
  });

  it('should be created', inject([MissingExchangeRatesService], (service: MissingExchangeRatesService) => {
    expect(service).toBeTruthy();
  }));
});
