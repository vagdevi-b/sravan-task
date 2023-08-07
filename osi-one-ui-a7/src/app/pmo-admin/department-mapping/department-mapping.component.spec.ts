import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentMappingComponent } from './department-mapping.component';

describe('DepartmentMappingComponent', () => {
  let component: DepartmentMappingComponent;
  let fixture: ComponentFixture<DepartmentMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
