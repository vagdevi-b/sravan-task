import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTeamUtilizationComponent } from './my-team-utilization.component';

const routes: Routes = [
  {
    path: '',
    component: MyTeamUtilizationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamUtilizationRoutingModule { }
