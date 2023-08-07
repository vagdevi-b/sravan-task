import { TestBed } from '@angular/core/testing';

import { PandlEmployeeTabService } from './pandl-employee-tab.service';

describe('PandlEmployeeTabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PandlEmployeeTabService = TestBed.get(PandlEmployeeTabService);
    expect(service).toBeTruthy();
  });
});
