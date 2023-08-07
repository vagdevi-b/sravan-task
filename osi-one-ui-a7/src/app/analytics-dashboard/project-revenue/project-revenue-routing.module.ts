import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectRevenueComponent } from './project-revenue.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectRevenueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRevenueRoutingModule { }
