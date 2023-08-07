import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsPandlDashboardComponent } from './projects-pandl-dashboard.component';

describe('ProjectsPandlDashboardComponent', () => {
  let component: ProjectsPandlDashboardComponent;
  let fixture: ComponentFixture<ProjectsPandlDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsPandlDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsPandlDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
