import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAttachmentComponent } from './expense-attachment.component';

describe('ExpenseAttachmentComponent', () => {
  let component: ExpenseAttachmentComponent;
  let fixture: ComponentFixture<ExpenseAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
