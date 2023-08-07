import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerApproveComponent } from './manager-approve.component';

describe('ManagerApproveComponent', () => {
  let component: ManagerApproveComponent;
  let fixture: ComponentFixture<ManagerApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
