import { TestBed, inject } from '@angular/core/testing';

import { UndeliveredInvoicesService } from './undelivered-invoices.service';

describe('UndeliveredInvoicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UndeliveredInvoicesService]
    });
  });

  it('should be created', inject([UndeliveredInvoicesService], (service: UndeliveredInvoicesService) => {
    expect(service).toBeTruthy();
  }));
});
