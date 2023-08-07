import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiletableComponent } from './profiletable.component';

describe('ProfiletableComponent', () => {
  let component: ProfiletableComponent;
  let fixture: ComponentFixture<ProfiletableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiletableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiletableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
