import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsDashboardComponent } from './my-projects-dashboard.component';

describe('MyProjectsDashboardComponent', () => {
  let component: MyProjectsDashboardComponent;
  let fixture: ComponentFixture<MyProjectsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProjectsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
