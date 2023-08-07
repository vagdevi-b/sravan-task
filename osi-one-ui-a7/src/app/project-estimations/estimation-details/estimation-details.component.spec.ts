import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationDetailsComponent } from './estimation-details.component';

describe('EstimationDetailsComponent', () => {
  let component: EstimationDetailsComponent;
  let fixture: ComponentFixture<EstimationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
