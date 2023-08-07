import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRevenueDistributionComponent } from './project-revenue-distribution.component';

describe('ProjectRevenueDistributionComponent', () => {
  let component: ProjectRevenueDistributionComponent;
  let fixture: ComponentFixture<ProjectRevenueDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRevenueDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRevenueDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
