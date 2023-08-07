import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { AccomplishedActivitiesComponent } from './accomplished-activities/accomplished-activities.component';
import { ActivitiesNextWeekComponent } from './activities-next-week/activities-next-week.component';
import { ActivitiesThisWeekComponent } from './activities-this-week/activities-this-week.component';
import { CriticalIssuesComponent } from './critical-issues/critical-issues.component';
import { PmActivitiesComponent } from './pm-activities/pm-activities.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { UnaccomplishedActivitiesComponent } from './unaccomplished-activities/unaccomplished-activities.component';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { ProjectService } from './project.service';

@NgModule({
  declarations: [
    PmActivitiesComponent,
    UnaccomplishedActivitiesComponent,
    ProjectStatusComponent,
    CriticalIssuesComponent,
    ActivitiesThisWeekComponent,
    ActivitiesNextWeekComponent,
    AccomplishedActivitiesComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedComponentsModule
  ],
  providers: [
    ProjectService
  ]
})
export class ProjectsModule { }
