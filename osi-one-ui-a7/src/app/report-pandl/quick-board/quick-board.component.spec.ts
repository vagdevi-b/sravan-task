import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickBoardComponent } from './quick-board.component';

describe('QuickBoardComponent', () => {
  let component: QuickBoardComponent;
  let fixture: ComponentFixture<QuickBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
