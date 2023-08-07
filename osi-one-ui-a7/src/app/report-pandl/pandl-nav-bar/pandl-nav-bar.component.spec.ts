import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PandlNavBarComponent } from './pandl-nav-bar.component';

describe('PandlNavBarComponent', () => {
  let component: PandlNavBarComponent;
  let fixture: ComponentFixture<PandlNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PandlNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PandlNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
