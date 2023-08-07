import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmDashboardRoutingModule } from './pm-dashboard-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { PmDashboardComponent } from './pm-dashboard.component';

@NgModule({
  declarations: [
    PmDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule
  ]
})
export class PmDashboardModule { }
