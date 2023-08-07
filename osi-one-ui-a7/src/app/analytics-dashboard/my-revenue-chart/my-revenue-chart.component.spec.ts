import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRevenueChartComponent } from './my-revenue-chart.component';

describe('MyRevenueChartComponent', () => {
  let component: MyRevenueChartComponent;
  let fixture: ComponentFixture<MyRevenueChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRevenueChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRevenueChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
