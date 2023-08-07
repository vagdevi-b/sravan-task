import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationFilterComponent } from './resignation-filter.component';

describe('ResignationFilterComponent', () => {
  let component: ResignationFilterComponent;
  let fixture: ComponentFixture<ResignationFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
