import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotepopupComponent } from './notepopup.component';

describe('NotepopupComponent', () => {
  let component: NotepopupComponent;
  let fixture: ComponentFixture<NotepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
