import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewExpenseComponent } from './review-expense.component';

describe('ReviewExpenseComponent', () => {
  let component: ReviewExpenseComponent;
  let fixture: ComponentFixture<ReviewExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
