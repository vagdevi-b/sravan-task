import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeavesComponent } from './viewleaves.component';

describe('ViewleavesComponent', () => {
  let component: ViewLeavesComponent;
  let fixture: ComponentFixture<ViewLeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLeavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
