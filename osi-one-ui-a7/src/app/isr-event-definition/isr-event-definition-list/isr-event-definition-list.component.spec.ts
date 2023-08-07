import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsrEventDefinitionListComponent } from './isr-event-definition-list.component';

describe('IsrEventDefinitionListComponent', () => {
  let component: IsrEventDefinitionListComponent;
  let fixture: ComponentFixture<IsrEventDefinitionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsrEventDefinitionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsrEventDefinitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
