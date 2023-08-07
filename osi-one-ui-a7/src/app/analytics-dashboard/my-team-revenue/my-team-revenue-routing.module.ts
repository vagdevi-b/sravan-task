import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTeamRevenueComponent } from './my-team-revenue.component';

const routes: Routes = [
  {
    path: '',
    component: MyTeamRevenueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamRevenueRoutingModule { }
