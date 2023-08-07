import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProjectsDashboardRoutingModule } from './my-projects-dashboard-routing.module';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { MyProjectsDashboardComponent } from './my-projects-dashboard.component';

@NgModule({
  declarations: [
    MyProjectsDashboardComponent
  ],
  imports: [
    CommonModule,
    MyProjectsDashboardRoutingModule,
    SharedComponentsModule
  ],
  exports:[
    MyProjectsDashboardComponent
  ]
})
export class MyProjectsDashboardModule { }
