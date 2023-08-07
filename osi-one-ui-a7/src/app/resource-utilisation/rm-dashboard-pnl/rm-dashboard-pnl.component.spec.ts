import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmDashboardPnlComponent } from './rm-dashboard-pnl.component';

describe('RmDashboardPnlComponent', () => {
  let component: RmDashboardPnlComponent;
  let fixture: ComponentFixture<RmDashboardPnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmDashboardPnlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmDashboardPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
