import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsrRegistrationListComponent } from './isr-registration-list.component';

describe('IsrRegistrationListComponent', () => {
  let component: IsrRegistrationListComponent;
  let fixture: ComponentFixture<IsrRegistrationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsrRegistrationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsrRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
