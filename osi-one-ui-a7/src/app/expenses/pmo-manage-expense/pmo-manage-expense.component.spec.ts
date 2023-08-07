import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmoManageExpenseComponent } from './pmo-manage-expense.component';

describe('PmoManageExpenseComponent', () => {
  let component: PmoManageExpenseComponent;
  let fixture: ComponentFixture<PmoManageExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmoManageExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmoManageExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
