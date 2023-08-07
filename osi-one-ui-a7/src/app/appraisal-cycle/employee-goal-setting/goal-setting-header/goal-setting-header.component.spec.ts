import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalSettingHeaderComponent } from './goal-setting-header.component';

describe('GoalSettingHeaderComponent', () => {
  let component: GoalSettingHeaderComponent;
  let fixture: ComponentFixture<GoalSettingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalSettingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalSettingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
