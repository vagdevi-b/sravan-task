import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationExitComponent } from './resignation-exit.component';

describe('ResignationExitComponent', () => {
  let component: ResignationExitComponent;
  let fixture: ComponentFixture<ResignationExitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationExitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
