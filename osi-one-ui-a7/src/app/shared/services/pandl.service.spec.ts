import { TestBed } from '@angular/core/testing';

import { PandlService } from './pandl.service';

describe('PandlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PandlService = TestBed.get(PandlService);
    expect(service).toBeTruthy();
  });
});
