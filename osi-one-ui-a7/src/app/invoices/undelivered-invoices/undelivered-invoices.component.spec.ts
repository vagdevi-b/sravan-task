import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndeliveredInvoicesComponent } from './undelivered-invoices.component';

describe('UndeliveredInvoicesComponent', () => {
  let component: UndeliveredInvoicesComponent;
  let fixture: ComponentFixture<UndeliveredInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndeliveredInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndeliveredInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
