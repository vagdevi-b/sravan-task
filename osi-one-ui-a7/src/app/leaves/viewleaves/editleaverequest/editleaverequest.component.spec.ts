import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditleaverequestComponent } from './editleaverequest.component';

describe('EditleaverequestComponent', () => {
  let component: EditleaverequestComponent;
  let fixture: ComponentFixture<EditleaverequestComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditleaverequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditleaverequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
