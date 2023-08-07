import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursedExpenseComponent } from './reimbursed-expense.component';

describe('ReimbursedExpenseComponent', () => {
  let component: ReimbursedExpenseComponent;
  let fixture: ComponentFixture<ReimbursedExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimbursedExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursedExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
