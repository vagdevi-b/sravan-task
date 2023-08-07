import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamGoalsRoutingModule } from './team-goals-routing.module';
import { TeamGoalsComponent } from './team-goals.component';
import { SharedComponentsModule } from '../../shared/component/shared-components/shared-components.module';
import { TeamGoalsListComponent } from './team-goals-list/team-goals-list.component';
import { AppraisalInfoComponent } from './appraisal-info/appraisal-info.component';

@NgModule({
  declarations: [
    // TeamGoalsComponent,
    // TeamGoalsListComponent,
    // AppraisalInfoComponent
  ],
  imports: [
    // CommonModule,
    // TeamGoalsRoutingModule,
    // SharedComponentsModule
  ]
})
export class TeamGoalsModule { }
