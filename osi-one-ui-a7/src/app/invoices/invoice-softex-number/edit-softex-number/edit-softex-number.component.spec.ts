import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoftexNumberComponent } from './edit-softex-number.component';

describe('EditSoftexNumberComponent', () => {
  let component: EditSoftexNumberComponent;
  let fixture: ComponentFixture<EditSoftexNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoftexNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoftexNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
