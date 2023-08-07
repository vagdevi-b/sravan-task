import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentpopupComponent } from './attachmentpopup.component';

describe('AttachmentpopupComponent', () => {
  let component: AttachmentpopupComponent;
  let fixture: ComponentFixture<AttachmentpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentpopupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
