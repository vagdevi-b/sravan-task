import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledlistComponent } from './scheduledlist.component';

describe('ScheduledlistComponent', () => {
  let component: ScheduledlistComponent;
  let fixture: ComponentFixture<ScheduledlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
