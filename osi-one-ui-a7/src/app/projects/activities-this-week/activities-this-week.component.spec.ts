import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesThisWeekComponent } from './activities-this-week.component';

describe('ActivitiesThisWeekComponent', () => {
  let component: ActivitiesThisWeekComponent;
  let fixture: ComponentFixture<ActivitiesThisWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesThisWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesThisWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
