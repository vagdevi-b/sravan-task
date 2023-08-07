import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceUtilisationComponent } from './resource-utilisation.component';

describe('ResourceUtilisationComponent', () => {
  let component: ResourceUtilisationComponent;
  let fixture: ComponentFixture<ResourceUtilisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceUtilisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceUtilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
