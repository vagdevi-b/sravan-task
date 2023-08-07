import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentrmComponent } from './attachmentrm.component';

describe('AttachmentrmComponent', () => {
  let component: AttachmentrmComponent;
  let fixture: ComponentFixture<AttachmentrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
