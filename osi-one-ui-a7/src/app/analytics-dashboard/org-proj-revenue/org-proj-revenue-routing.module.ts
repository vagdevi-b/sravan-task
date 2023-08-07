import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrgProjRevenueComponent } from './org-proj-revenue.component';

const routes: Routes = [
  {
    path: '',
    component: OrgProjRevenueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgProjRevenueRoutingModule { }
