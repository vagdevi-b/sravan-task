import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryQuickBoardComponent } from './summary-quick-board.component';

describe('SummaryQuickBoardComponent', () => {
  let component: SummaryQuickBoardComponent;
  let fixture: ComponentFixture<SummaryQuickBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryQuickBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryQuickBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
