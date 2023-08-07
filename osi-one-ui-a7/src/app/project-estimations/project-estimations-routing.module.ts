import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstimationDetailsComponent } from './estimation-details/estimation-details.component';

const routes: Routes = [
  {
    path: 'project-estimations',
    component: EstimationDetailsComponent,
    data: {
      title: 'Project Estimations'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectEstimationsRoutingModule { }
