import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResourceExpensesComponent } from './my-resource-expenses.component';

describe('MyResourceExpensesComponent', () => {
  let component: MyResourceExpensesComponent;
  let fixture: ComponentFixture<MyResourceExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyResourceExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyResourceExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
