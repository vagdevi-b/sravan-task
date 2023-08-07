import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRevenueSqlComponent } from './project-revenue-sql.component';

describe('ProjectRevenueSqlComponent', () => {
  let component: ProjectRevenueSqlComponent;
  let fixture: ComponentFixture<ProjectRevenueSqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRevenueSqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRevenueSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
