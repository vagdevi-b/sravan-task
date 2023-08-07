import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPlprojectComponent } from './report-plproject.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPlprojectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPlprojectRoutingModule { }
