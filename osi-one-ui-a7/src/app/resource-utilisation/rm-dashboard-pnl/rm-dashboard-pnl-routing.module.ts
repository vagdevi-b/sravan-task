import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RmDashboardPnlComponent } from './rm-dashboard-pnl.component';

const routes: Routes = [
  {
    path: '',
    component: RmDashboardPnlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RmDashboardPnlRoutingModule { }
