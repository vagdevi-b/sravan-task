import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportPldataComponent } from './report-pldata.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPldataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportPldataRoutingModule { }
