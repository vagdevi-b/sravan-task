import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmDashboardComponent } from './rm-dashboard.component';

describe('RmDashboardComponent', () => {
  let component: RmDashboardComponent;
  let fixture: ComponentFixture<RmDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
