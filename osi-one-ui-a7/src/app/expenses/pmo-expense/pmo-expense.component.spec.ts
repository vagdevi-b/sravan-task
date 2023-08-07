import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoExpenseComponent } from './pmo-expense.component';

describe('PmoExpenseComponent', () => {
  let component: PmoExpenseComponent;
  let fixture: ComponentFixture<PmoExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmoExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmoExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
