import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationPdComponent } from './resignation-pd.component';

describe('ResignationPdComponent', () => {
  let component: ResignationPdComponent;
  let fixture: ComponentFixture<ResignationPdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResignationPdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationPdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
