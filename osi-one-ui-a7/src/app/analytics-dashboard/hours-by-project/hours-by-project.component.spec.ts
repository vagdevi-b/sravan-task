import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursByProjectComponent } from './hours-by-project.component';

describe('HoursByProjectComponent', () => {
  let component: HoursByProjectComponent;
  let fixture: ComponentFixture<HoursByProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursByProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursByProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
