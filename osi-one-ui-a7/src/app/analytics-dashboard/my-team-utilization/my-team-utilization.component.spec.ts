import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamUtilizationComponent } from './my-team-utilization.component';

describe('MyTeamUtilizationComponent', () => {
  let component: MyTeamUtilizationComponent;
  let fixture: ComponentFixture<MyTeamUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTeamUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
