import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RmDashboardPnlRoutingModule } from './rm-dashboard-pnl-routing.module';
import { RmDashboardPnlComponent } from './rm-dashboard-pnl.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    RmDashboardPnlComponent
  ],
  imports: [
    CommonModule,
    RmDashboardPnlRoutingModule,
    AgGridModule.withComponents([]),
    SharedComponentsModule
  ],
  exports: [
    RmDashboardPnlComponent
  ]
})
export class RmDashboardPnlModule { }
