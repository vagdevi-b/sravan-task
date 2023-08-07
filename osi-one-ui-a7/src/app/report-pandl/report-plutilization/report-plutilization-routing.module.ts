import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPlutilizationComponent } from './report-plutilization.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPlutilizationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPlutilizationRoutingModule { }
