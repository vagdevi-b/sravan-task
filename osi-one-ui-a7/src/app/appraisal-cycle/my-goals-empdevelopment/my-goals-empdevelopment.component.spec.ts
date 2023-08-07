import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGoalsEmpdevelopmentComponent } from './my-goals-empdevelopment.component';

describe('MyGoalsEmpdevelopmentComponent', () => {
  let component: MyGoalsEmpdevelopmentComponent;
  let fixture: ComponentFixture<MyGoalsEmpdevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGoalsEmpdevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGoalsEmpdevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
