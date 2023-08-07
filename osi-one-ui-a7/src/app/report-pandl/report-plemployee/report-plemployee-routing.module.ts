import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPlemployeeComponent } from './report-plemployee.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPlemployeeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPlemployeeRoutingModule { }
