import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamGoalsComponent } from './team-goals.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TeamGoalsComponent,
  //   data: {
  //     title: "Team Goals"
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamGoalsRoutingModule { }
