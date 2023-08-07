import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyResourcesDashboardRoutingModule } from './my-resources-dashboard-routing.module';
import { MyResourcesDashboardComponent } from './my-resources-dashboard.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    MyResourcesDashboardComponent
  ],
  imports: [
    CommonModule,
    MyResourcesDashboardRoutingModule,
    SharedComponentsModule
  ],
  exports:[
    MyResourcesDashboardComponent
  ]
})
export class MyResourcesDashboardModule { }
