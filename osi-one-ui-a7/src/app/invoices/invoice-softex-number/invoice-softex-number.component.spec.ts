import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSoftexNumberComponent } from './invoice-softex-number.component';

describe('InvoiceSoftexNumberComponent', () => {
  let component: InvoiceSoftexNumberComponent;
  let fixture: ComponentFixture<InvoiceSoftexNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSoftexNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSoftexNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
