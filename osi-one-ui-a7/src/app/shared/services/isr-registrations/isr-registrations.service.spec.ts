import { TestBed } from '@angular/core/testing';

import { IsrRegistrationsService } from './isr-registrations.service';

describe('IsrRegistrationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsrRegistrationsService = TestBed.get(IsrRegistrationsService);
    expect(service).toBeTruthy();
  });
});
