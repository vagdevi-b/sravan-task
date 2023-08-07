import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmDashboardRoutingModule } from './rm-dashboard-routing.module';
import { RmDashboardComponent } from './rm-dashboard.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    RmDashboardComponent
  ],
  imports: [
    CommonModule,
    RmDashboardRoutingModule,
    AgGridModule.withComponents([]),
    SharedComponentsModule
  ],
  exports: [
    RmDashboardComponent
  ]
})
export class RmDashboardModule { }
