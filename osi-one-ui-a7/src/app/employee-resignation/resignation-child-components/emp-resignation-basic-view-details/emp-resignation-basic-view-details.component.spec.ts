import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpResignationBasicViewDetailsComponent } from './emp-resignation-basic-view-details.component';

describe('EmpResignationBasicViewDetailsComponent', () => {
  let component: EmpResignationBasicViewDetailsComponent;
  let fixture: ComponentFixture<EmpResignationBasicViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpResignationBasicViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpResignationBasicViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
