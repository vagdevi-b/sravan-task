import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationHrComponent } from './resignation-hr.component';

describe('ResignationHrComponent', () => {
  let component: ResignationHrComponent;
  let fixture: ComponentFixture<ResignationHrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationHrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
