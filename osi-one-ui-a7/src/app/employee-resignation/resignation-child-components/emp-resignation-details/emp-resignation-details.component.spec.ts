import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResignationDetailsComponent } from './emp-resignation-details.component';

describe('EmpResignationDetailsComponent', () => {
  let component: EmpResignationDetailsComponent;
  let fixture: ComponentFixture<EmpResignationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpResignationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpResignationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
