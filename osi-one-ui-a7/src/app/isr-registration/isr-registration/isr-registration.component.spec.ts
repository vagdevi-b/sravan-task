import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsrRegistrationComponent } from './isr-registration.component';

describe('IsrRegistrationComponent', () => {
  let component: IsrRegistrationComponent;
  let fixture: ComponentFixture<IsrRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsrRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsrRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
