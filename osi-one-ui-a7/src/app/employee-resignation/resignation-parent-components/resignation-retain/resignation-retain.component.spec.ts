import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationRetainComponent } from './resignation-retain.component';

describe('ResignationRetainComponent', () => {
  let component: ResignationRetainComponent;
  let fixture: ComponentFixture<ResignationRetainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationRetainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationRetainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
