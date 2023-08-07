import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyResourcesDashboardComponent } from './my-resources-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MyResourcesDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyResourcesDashboardRoutingModule { }
