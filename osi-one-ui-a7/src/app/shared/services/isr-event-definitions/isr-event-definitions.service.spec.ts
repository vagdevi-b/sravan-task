import { TestBed } from '@angular/core/testing';

import { IsrEventDefinitionsService } from './isr-event-definitions.service';

describe('IsrEventDefinitionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsrEventDefinitionsService = TestBed.get(IsrEventDefinitionsService);
    expect(service).toBeTruthy();
  });
});
