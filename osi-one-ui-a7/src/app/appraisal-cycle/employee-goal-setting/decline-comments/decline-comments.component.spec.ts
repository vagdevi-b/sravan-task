import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineCommentsComponent } from './decline-comments.component';

describe('DeclineCommentsComponent', () => {
  let component: DeclineCommentsComponent;
  let fixture: ComponentFixture<DeclineCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclineCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclineCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
