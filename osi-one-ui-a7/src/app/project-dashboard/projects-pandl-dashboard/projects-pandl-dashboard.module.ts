import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsPandlDashboardComponent } from './projects-pandl-dashboard.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';

@NgModule({
  declarations: [
    ProjectsPandlDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule
  ],
  exports: [
    ProjectsPandlDashboardComponent
  ]
})
export class ProjectsPandlDashboardModule { }
