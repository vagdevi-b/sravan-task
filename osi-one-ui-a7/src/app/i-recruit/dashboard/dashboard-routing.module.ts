import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardpageComponent } from './dashboardpage/dashboardpage.component';

const routes: Routes = [
  {path:'',component:DashboardpageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
