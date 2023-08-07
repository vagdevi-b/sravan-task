import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExpensesComponent } from './project-expenses.component';

describe('ProjectExpensesComponent', () => {
  let component: ProjectExpensesComponent;
  let fixture: ComponentFixture<ProjectExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
