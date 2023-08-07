import { TestBed } from '@angular/core/testing';

import { PandlDetailsTabService } from './pandl-details-tab.service';

describe('PandlDetailsTabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PandlDetailsTabService = TestBed.get(PandlDetailsTabService);
    expect(service).toBeTruthy();
  });
});
