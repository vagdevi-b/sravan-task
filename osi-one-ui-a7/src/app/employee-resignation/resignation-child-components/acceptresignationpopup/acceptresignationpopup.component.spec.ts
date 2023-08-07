import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptresignationpopupComponent } from './acceptresignationpopup.component';

describe('AcceptresignationpopupComponent', () => {
  let component: AcceptresignationpopupComponent;
  let fixture: ComponentFixture<AcceptresignationpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptresignationpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptresignationpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
