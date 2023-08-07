import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardGridComponent } from './dashboard-grid.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardGridComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardGridRoutingModule { }
