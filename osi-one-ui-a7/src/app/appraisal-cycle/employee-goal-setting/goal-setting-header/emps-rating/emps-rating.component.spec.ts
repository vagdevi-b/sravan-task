import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpsRatingComponent } from './emps-rating.component';

describe('EmpsRatingComponent', () => {
  let component: EmpsRatingComponent;
  let fixture: ComponentFixture<EmpsRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpsRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpsRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
