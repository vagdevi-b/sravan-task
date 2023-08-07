import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectRevenueDistributionComponent } from './project-revenue-distribution.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectRevenueDistributionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRevenueDistributionRoutingModule { }
