import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:'requests',loadChildren:'./requests/requests.module#RequestsModule'},
  {path:'dashboard',loadChildren:'./requests/requests.module#DashboardModule'},
  //{path:'dashboard',loadChildren:'./dashboard/dashboard.module#DashboardModule'},
  { path: 'evaluation',  loadChildren:'./evaluation/evaluation.module#EvaluationModule'},
  { path: 'candidates',  loadChildren:'./profile/profile.module#ProfileModule'},
  { path: 'schedule',  loadChildren:'./scheduled/scheduled.module#ScheduledModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IRecruitRoutingModule { }
