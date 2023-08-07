import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResignationListComponent } from './emp-resignation-list.component';

describe('EmpResignationListComponent', () => {
  let component: EmpResignationListComponent;
  let fixture: ComponentFixture<EmpResignationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpResignationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpResignationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
