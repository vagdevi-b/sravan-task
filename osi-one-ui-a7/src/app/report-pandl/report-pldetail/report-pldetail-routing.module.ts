import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPldetailComponent } from './report-pldetail.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPldetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPldetailRoutingModule { }
