import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerExpenseComponent } from './manager-expense.component';

describe('ManagerExpenseComponent', () => {
  let component: ManagerExpenseComponent;
  let fixture: ComponentFixture<ManagerExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
