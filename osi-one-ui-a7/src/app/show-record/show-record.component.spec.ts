import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRecordComponent } from './show-record.component';

describe('ShowRecordComponent', () => {
  let component: ShowRecordComponent;
  let fixture: ComponentFixture<ShowRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
