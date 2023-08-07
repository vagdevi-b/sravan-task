import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewhistoryExpenseComponent } from './viewhistory-expense.component';

describe('ViewhistoryExpenseComponent', () => {
  let component: ViewhistoryExpenseComponent;
  let fixture: ComponentFixture<ViewhistoryExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewhistoryExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewhistoryExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
