import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFutureRevenueComponent } from './my-future-revenue.component';

describe('MyFutureRevenueComponent', () => {
  let component: MyFutureRevenueComponent;
  let fixture: ComponentFixture<MyFutureRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFutureRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFutureRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
