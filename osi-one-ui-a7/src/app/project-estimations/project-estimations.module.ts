import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectEstimationsRoutingModule } from './project-estimations-routing.module';
import { SharedComponentsModule } from '../shared/component/shared-components/shared-components.module';
import { EstimationDetailsComponent } from './estimation-details/estimation-details.component';
import { ProjectService } from '../projects/project.service';

@NgModule({
  declarations: [
    EstimationDetailsComponent
  ],
  imports: [
    CommonModule,
    ProjectEstimationsRoutingModule,
    SharedComponentsModule
  ],
  providers: [
    ProjectService
  ]
})
export class ProjectEstimationsModule { }
