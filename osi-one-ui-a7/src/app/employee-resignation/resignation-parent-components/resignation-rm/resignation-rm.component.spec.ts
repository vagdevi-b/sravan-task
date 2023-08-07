import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationRmComponent } from './resignation-rm.component';

describe('ResignationRmComponent', () => {
  let component: ResignationRmComponent;
  let fixture: ComponentFixture<ResignationRmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationRmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationRmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
