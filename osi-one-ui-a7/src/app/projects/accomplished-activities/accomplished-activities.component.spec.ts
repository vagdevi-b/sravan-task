import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomplishedActivitiesComponent } from './accomplished-activities.component';

describe('AccomplishedActivitiesComponent', () => {
  let component: AccomplishedActivitiesComponent;
  let fixture: ComponentFixture<AccomplishedActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccomplishedActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccomplishedActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
