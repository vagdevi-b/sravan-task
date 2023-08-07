import { TestBed } from '@angular/core/testing';

import { PandlSummaryTabService } from './pandl-summary-tab.service';

describe('PandlSummaryTabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PandlSummaryTabService = TestBed.get(PandlSummaryTabService);
    expect(service).toBeTruthy();
  });
});
