import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnaccomplishedActivitiesComponent } from './unaccomplished-activities.component';

describe('UnaccomplishedActivitiesComponent', () => {
  let component: UnaccomplishedActivitiesComponent;
  let fixture: ComponentFixture<UnaccomplishedActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnaccomplishedActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnaccomplishedActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
