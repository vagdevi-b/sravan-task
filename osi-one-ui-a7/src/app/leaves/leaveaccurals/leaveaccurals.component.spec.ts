import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveAccuralsComponent } from './leaveaccurals.component';


describe('LeaveAccuralsComponent', () => {
  let component: LeaveAccuralsComponent;
  let fixture: ComponentFixture<LeaveAccuralsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveAccuralsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAccuralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
