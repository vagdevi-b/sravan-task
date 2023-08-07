import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResourcesDashboardComponent } from './my-resources-dashboard.component';

describe('MyResourcesDashboardComponent', () => {
  let component: MyResourcesDashboardComponent;
  let fixture: ComponentFixture<MyResourcesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyResourcesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyResourcesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
