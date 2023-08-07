import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowRecordRoutingModule } from './show-record-routing.module';
import { ShowRecordComponent } from './show-record.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    ShowRecordComponent
  ],
  imports: [
    CommonModule,
    ShowRecordRoutingModule,
    AgGridModule.withComponents([])

  ]
})
export class ShowRecordModule { }
