import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeGoalSettingComponent } from './employee-goal-setting.component';

describe('EmployeeGoalSettingComponent', () => {
  let component: EmployeeGoalSettingComponent;
  let fixture: ComponentFixture<EmployeeGoalSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeGoalSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeGoalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
