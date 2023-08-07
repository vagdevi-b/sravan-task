/**
 * Osi-Ag-Grid Module
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { GridButtonsComponent } from './grid-buttons.component';
import { OsiAgGridComponent } from './osi-ag-grid.component';

@NgModule({
  imports: [
      CommonModule,
      AgGridModule.withComponents([])
  ],
  declarations: [
      GridButtonsComponent,
      OsiAgGridComponent
    ],  
  exports: [
      OsiAgGridComponent
    ]   
})
export class OsiAgGridModule {}

