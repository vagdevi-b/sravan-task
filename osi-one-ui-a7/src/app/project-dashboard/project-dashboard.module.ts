import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectDashboardRoutingModule } from './project-dashboard-routing.module';
import { ProjectDashboardComponent } from './project-dashboard.component';
import { ProjectsPandlDashboardModule } from './projects-pandl-dashboard/projects-pandl-dashboard.module';
import { MyProjectsDashboardModule } from './my-projects-dashboard/my-projects-dashboard.module';

@NgModule({
  declarations: [
    ProjectDashboardComponent
  ],
  imports: [
    CommonModule,
    ProjectDashboardRoutingModule,
    ProjectsPandlDashboardModule,
    MyProjectsDashboardModule
  ]
})
export class ProjectDashboardModule { }
