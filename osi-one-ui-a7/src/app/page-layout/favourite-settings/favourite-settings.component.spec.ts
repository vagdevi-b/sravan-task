import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteSettingsComponent } from './favourite-settings.component';

describe('FavouriteSettingsComponent', () => {
  let component: FavouriteSettingsComponent;
  let fixture: ComponentFixture<FavouriteSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
