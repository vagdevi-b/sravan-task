import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourceUtilisationRoutingModule } from './resource-utilisation-routing.module';
import { ResourceUtilisationComponent } from './resource-utilisation.component';
import { RmDashboardPnlModule } from './rm-dashboard-pnl/rm-dashboard-pnl.module';
import { RmDashboardModule } from './rm-dashboard/rm-dashboard.module';
import { MyResourcesDashboardModule } from './my-resources-dashboard/my-resources-dashboard.module';

@NgModule({
  declarations: [
    ResourceUtilisationComponent
  ],
  imports: [
    CommonModule,
    ResourceUtilisationRoutingModule,
    RmDashboardPnlModule,
    RmDashboardModule,
    MyResourcesDashboardModule
  ]
})
export class ResourceUtilisationModule { }
