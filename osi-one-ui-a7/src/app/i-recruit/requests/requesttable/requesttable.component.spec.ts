import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesttableComponent } from './requesttable.component';

describe('RequesttableComponent', () => {
  let component: RequesttableComponent;
  let fixture: ComponentFixture<RequesttableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequesttableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequesttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
