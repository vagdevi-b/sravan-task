import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableExternalComponent } from './data-table-external.component';

describe('DataTableExternalComponent', () => {
  let component: DataTableExternalComponent;
  let fixture: ComponentFixture<DataTableExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTableExternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
