import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmActivitiesComponent } from './pm-activities.component';

describe('PmActivitiesComponent', () => {
  let component: PmActivitiesComponent;
  let fixture: ComponentFixture<PmActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
