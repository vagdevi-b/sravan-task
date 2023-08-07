import { TestBed, inject } from '@angular/core/testing';

import { PersonalDashboardService } from './personal-dashboard.service';

describe('PersonalDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalDashboardService]
    });
  });

  it('should be created', inject([PersonalDashboardService], (service: PersonalDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
