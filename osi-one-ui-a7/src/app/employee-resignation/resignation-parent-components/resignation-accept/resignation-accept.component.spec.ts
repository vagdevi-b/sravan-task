import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationAcceptComponent } from './resignation-accept.component';

describe('ResignationAcceptComponent', () => {
  let component: ResignationAcceptComponent;
  let fixture: ComponentFixture<ResignationAcceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationAcceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
