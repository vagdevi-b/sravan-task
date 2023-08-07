import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursByResourceComponent } from './hours-by-resource.component';

describe('HoursByResourceComponent', () => {
  let component: HoursByResourceComponent;
  let fixture: ComponentFixture<HoursByResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursByResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursByResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
