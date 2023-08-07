import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsrEventDefinitionComponent } from './isr-event-definition.component';

describe('IsrEventDefinitionComponent', () => {
  let component: IsrEventDefinitionComponent;
  let fixture: ComponentFixture<IsrEventDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsrEventDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsrEventDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
