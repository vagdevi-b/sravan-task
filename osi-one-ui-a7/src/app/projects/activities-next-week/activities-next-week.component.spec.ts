import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesNextWeekComponent } from './activities-next-week.component';

describe('ActivitiesNextWeekComponent', () => {
  let component: ActivitiesNextWeekComponent;
  let fixture: ComponentFixture<ActivitiesNextWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesNextWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesNextWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
